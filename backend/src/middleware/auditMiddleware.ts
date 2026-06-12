import { Request, Response, NextFunction } from 'express';
import { logAction } from '../services/auditService';

export const auditMiddleware = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const ip = req.ip;
    
    // Podemos guardar params, body o query como detalles, pero hay que tener cuidado
    // de no loggear contraseñas u otra info sensible.
    const details = {
      params: req.params,
      query: req.query,
      // Solo guardamos el body si no es una ruta de auth
      body: req.originalUrl.includes('/auth') ? undefined : req.body,
    };

    logAction({ userId, action, details, ip });

    next();
  };
};
