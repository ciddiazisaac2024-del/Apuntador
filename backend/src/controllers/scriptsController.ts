import { Request, Response } from 'express';
import prisma from '../config/db';

export const searchScripts = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }

    const cases = await prisma.case.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        type: true,
        content: true
      }
    });

    res.json({ cases });
  } catch (error) {
    console.error('Error in searchScripts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
