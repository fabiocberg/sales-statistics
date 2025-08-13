import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

const toInt = (v: unknown, def: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : def;
};

// POST /clients
router.post('/', (req: Request, res: Response) => {
  const body = (req.body || {}) as { name?: string; email?: string; phone?: string; birthdate?: string };
  const cName = body.name;
  const cEmail = body.email;
  const cPhone = body.phone;
  const cBirth = body.birthdate;
  if (!cName) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const stmt = db.prepare(`
      INSERT INTO clients (name, email, phone, birthdate, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    const info = stmt.run(cName, cEmail ? cEmail.toLowerCase() : null, cPhone || null, cBirth || null);
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(info.lastInsertRowid);
    return res.status(201).json(client);
  } catch (e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email de cliente já cadastrado' });
    }
    return res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// GET /clients
router.get('/', (req: Request, res: Response) => {
  const { name: qName, email: qEmail, page = '1', pageSize } =
    req.query as { name?: string; email?: string; page?: string; pageSize?: string };

  let sql = 'SELECT * FROM clients WHERE 1=1';
  const params: any[] = [];
  if (qName) { sql += ' AND LOWER(name) LIKE ?'; params.push(`%${String(qName).toLowerCase()}%`); }
  if (qEmail) { sql += ' AND LOWER(email) LIKE ?'; params.push(`%${String(qEmail).toLowerCase()}%`); }
  sql += ' ORDER BY id DESC';

  let rows: any[] = db.prepare(sql).all(...params);

  const p = toInt(page, 1);
  if (pageSize !== undefined) {
    const size = toInt(pageSize, 10);
    const start = (p - 1) * size;
    rows = rows.slice(start, start + size);
  }

  const clientes = rows.map((c: any) => {
    const vendas = db.prepare('SELECT date, amount FROM sales WHERE client_id = ? ORDER BY date ASC').all(c.id)
      .map((s: any) => ({ data: s.date, valor: s.amount }));
    const nomeCompleto = c.name;
    return {
      info: { nomeCompleto, detalhes: { email: c.email, nascimento: c.birthdate || null } },
      duplicado: { nomeCompleto },
      estatisticas: { vendas },
    };
  });

  const response = { data: { clientes }, meta: { registroTotal: clientes.length, pagina: p }, redundante: { status: 'ok' } };
  return res.json(response);
});

// GET /clients/:page
router.get('/:page', (req: Request, res: Response) => {
  const pageParam = toInt(req.params.page, 1);
  const { name: qName, email: qEmail, pageSize } =
    req.query as { name?: string; email?: string; pageSize?: string };

  let sql = 'SELECT * FROM clients WHERE 1=1';
  const params: any[] = [];
  if (qName) { sql += ' AND LOWER(name) LIKE ?'; params.push(`%${String(qName).toLowerCase()}%`); }
  if (qEmail) { sql += ' AND LOWER(email) LIKE ?'; params.push(`%${String(qEmail).toLowerCase()}%`); }
  sql += ' ORDER BY id DESC';

  let rows: any[] = db.prepare(sql).all(...params);

  const p = Math.max(1, pageParam);
  if (pageSize !== undefined) {
    const size = toInt(pageSize, 10);
    const start = (p - 1) * size;
    rows = rows.slice(start, start + size);
  }

  const clientes = rows.map((c: any) => {
    const vendas = db.prepare('SELECT date, amount FROM sales WHERE client_id = ? ORDER BY date ASC').all(c.id)
      .map((s: any) => ({ data: s.date, valor: s.amount }));
    const nomeCompleto = c.name;
    return {
      info: { nomeCompleto, detalhes: { email: c.email, nascimento: c.birthdate || null } },
      duplicado: { nomeCompleto },
      estatisticas: { vendas },
    };
  });

  const response = { data: { clientes }, meta: { registroTotal: clientes.length, pagina: p }, redundante: { status: 'ok' } };
  return res.json(response);
});

// PUT /clients/:id
router.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });
  const body = (req.body || {}) as { name?: string; email?: string; phone?: string; birthdate?: string };
  const cName = body.name;
  const cEmail = body.email;
  const cPhone = body.phone;
  const cBirth = body.birthdate;

  try {
    const current = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ error: 'Cliente não encontrado' });

    const stmt = db.prepare(`
      UPDATE clients SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        birthdate = COALESCE(?, birthdate),
        updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(cName ?? null, cEmail ? cEmail.toLowerCase() : null, cPhone ?? null, cBirth ?? null, id);
    const updated = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
    return res.json(updated);
  } catch (e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email de cliente já cadastrado' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// DELETE /clients/:id
router.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });
  const info = db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
  return res.status(204).send();
});

export default router;
