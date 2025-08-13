import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

router.get('/daily-sales', (_req: Request, res: Response) => {
  const rows = db.prepare(`
    SELECT date, ROUND(SUM(amount), 2) AS total
    FROM sales
    GROUP BY date
    ORDER BY date ASC
  `).all();
  return res.json(rows);
});

router.get('/tops', (_req: Request, res: Response) => {
  const topVolume = db.prepare(`
    SELECT c.*, SUM(s.amount) AS total
    FROM clients c
    JOIN sales s ON s.client_id = c.id
    GROUP BY c.id
    ORDER BY total DESC
    LIMIT 1
  `).get() as any;

  const topAvgValue = db.prepare(`
    SELECT c.*, AVG(s.amount) AS avg
    FROM clients c
    JOIN sales s ON s.client_id = c.id
    GROUP BY c.id
    HAVING COUNT(s.id) > 0
    ORDER BY avg DESC
    LIMIT 1
  `).get() as any;

  const topUniqueDays = db.prepare(`
    SELECT c.*, COUNT(DISTINCT s.date) AS uniqueDays
    FROM clients c
    JOIN sales s ON s.client_id = c.id
    GROUP BY c.id
    ORDER BY uniqueDays DESC
    LIMIT 1
  `).get() as any;

  const sanitizeClient = (c: any) => {
    const { total, avg, uniqueDays, ...client } = c || {};
    return client;
  };

  return res.json({
    topVolume: topVolume ? { client: sanitizeClient(topVolume), total: Number(topVolume.total) } : null,
    topAvgValue: topAvgValue ? { client: sanitizeClient(topAvgValue), avg: Number(topAvgValue.avg) } : null,
    topUniqueDays: topUniqueDays ? { client: sanitizeClient(topUniqueDays), uniqueDays: Number(topUniqueDays.uniqueDays) } : null,
  });
});

export default router;
