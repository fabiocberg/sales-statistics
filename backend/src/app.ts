import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authMiddleware from './middleware/auth';

import authRoutes from './routes/auth';
import clientsRoutes from './routes/clients';
import salesRoutes from './routes/sales';
import statsRoutes from './routes/stats';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);

app.use('/clients', authMiddleware, clientsRoutes);
app.use('/sales', authMiddleware, salesRoutes);
app.use('/stats', authMiddleware, statsRoutes);

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno' });
});

export default app;
