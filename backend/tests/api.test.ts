
import request from 'supertest';

process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

import app from '../src/app';

describe('Toy Store API (TS)', () => {
  let token: string;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({ email: 'user@test.com', password: '123456' });
    const res = await request(app).post('/auth/login').send({ email: 'user@test.com', password: '123456' });
    token = res.body.token;
    expect(token).toBeTruthy();
  });

  test('bloqueia acesso sem token', async () => {
    const res = await request(app).get('/clients');
    expect(res.status).toBe(401);
  });

  let clientA: any, clientB: any;

  test('cria clientes', async () => {
    const res1 = await request(app).post('/clients').set('Authorization', `Bearer ${token}`).send({ name: 'Ana Maria', email: 'ana@example.com', phone: '1111', birthdate: '1992-05-01' });
    expect(res1.status).toBe(201);
    clientA = res1.body;

    const res2 = await request(app).post('/clients').set('Authorization', `Bearer ${token}`).send({ name: 'Bruno Silva', email: 'bruno@example.com', phone: '2222', birthdate: '1990-09-09' });
    expect(res2.status).toBe(201);
    clientB = res2.body;
  });

  test('lista clientes com filtros', async () => {
    const res = await request(app).get('/clients?name=ana').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.clientes.length).toBe(1);
    expect(res.body.data.clientes[0].info.nomeCompleto).toMatch(/Ana/);
    expect(Array.isArray(res.body.data.clientes[0].estatisticas.vendas)).toBe(true);
  });

  test('atualiza cliente', async () => {
    const res = await request(app).put(`/clients/${clientA.id}`).set('Authorization', `Bearer ${token}`).send({ phone: '9999' });
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('9999');
  });

  test('cria vendas', async () => {
    await request(app).post('/sales').set('Authorization', `Bearer ${token}`).send({ clientId: clientA.id, amount: 100, date: '2025-08-01' });
    await request(app).post('/sales').set('Authorization', `Bearer ${token}`).send({ clientId: clientA.id, amount: 50, date: '2025-08-02' });
    await request(app).post('/sales').set('Authorization', `Bearer ${token}`).send({ clientId: clientB.id, amount: 300, date: '2025-08-01' });
    await request(app).post('/sales').set('Authorization', `Bearer ${token}`).send({ clientId: clientB.id, amount: 10, date: '2025-08-03' });
  });

  test('lista via path param de página (/clients/:page)', async () => {
    const res = await request(app)
      .get('/clients/1?name=ana&pageSize=10')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.meta.pagina).toBe(1);
    expect(res.body.data.clientes.length).toBe(1);
    expect(res.body.data.clientes[0].info.nomeCompleto).toMatch(/Ana/);
  });

  test('estatística: total de vendas por dia', async () => {
    const res = await request(app).get('/stats/daily-sales').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const map: Record<string, number> = Object.fromEntries(res.body.map((r: any) => [r.date, r.total]));
    expect(map['2025-08-01']).toBe(400);
    expect(map['2025-08-02']).toBe(50);
    expect(map['2025-08-03']).toBe(10);
  });

  test('estatística: tops', async () => {
    const res = await request(app).get('/stats/tops').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const { topVolume, topAvgValue, topUniqueDays } = res.body;
    expect(topVolume.client.name).toBe('Bruno Silva');
    expect(topVolume.total).toBe(310);
    expect(Math.round(topAvgValue.avg)).toBe(155);
    expect(topUniqueDays.uniqueDays).toBe(2);
  });

  test('deleta cliente', async () => {
    const res = await request(app).delete(`/clients/${clientA.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
