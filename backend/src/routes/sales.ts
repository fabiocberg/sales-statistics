import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { clientId, amount, date } = (req.body || {}) as { clientId?: number; amount?: number; date?: string };
  if (!clientId || amount == null) return res.status(400).json({ error: 'clientId e amount são obrigatórios' });
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(clientId);
  if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });

  const isoDate = date ? String(date) : new Date().toISOString().slice(0,10);
  try {
    const info = db.prepare('INSERT INTO sales (client_id, amount, date) VALUES (?, ?, ?)').run(clientId, Number(amount), isoDate);
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(info.lastInsertRowid);
    return res.status(201).json(sale);
  } catch (e) {
    return res.status(500).json({ error: 'Erro ao criar venda' });
  }
});

export default router;
