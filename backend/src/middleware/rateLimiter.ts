import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Import to ensure the global Express.Request type extensions are available
import './auth';

const keyGenerator = (req: Request): string => {
  // Try to use the userId if the authenticate middleware has set it
  if (req.user?.id) {
    return req.user.id;
  }
  // Fall back to the IP address
  return req.ip || 'unknown';
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana para toda la API
  keyGenerator,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true, // Devuelve info de rate limit en headers `RateLimit-*`
  legacyHeaders: false,  // Desactiva headers `X-RateLimit-*` (obsoletos)
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // límite de 10 intentos por IP/usuario en ese período
  keyGenerator,
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
