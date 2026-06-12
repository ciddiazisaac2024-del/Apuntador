import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import casesRoutes from './routes/cases';
import scriptsRoutes from './routes/scripts';

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Permite el envío de cookies
}));

import { apiLimiter } from './middleware/rateLimiter';

app.use(express.json());
app.use(cookieParser()); // ✅ Parsea cookies en req.cookies

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/scripts', scriptsRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
