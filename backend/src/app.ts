import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import casesRoutes from './routes/cases';
import scriptsRoutes from './routes/scripts';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/scripts', scriptsRoutes);

export default app;
