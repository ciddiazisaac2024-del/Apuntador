import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCases = async (req: Request, res: Response) => {
  try {
    const cases = await prisma.case.findMany({
      select: {
        id: true,
        name: true,
        type: true
      }
    });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCase = async (req: Request, res: Response) => {
  try {
    const { name, type, content } = req.body;
    
    // ✅ Validación agregada
    if (!name || !type || !content) {
      return res.status(400).json({ error: 'Name, type, and content are required' });
    }
    
    const createdById = req.user!.id; // from auth middleware

    const newCase = await prisma.case.create({
      data: { name, type, content, createdById }
    });
    res.status(201).json(newCase);
  } catch (error: any) {
    // ✅ Diferenciar error de unique constraint
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'A case with this name already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCase = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, type, content } = req.body;

    const updatedCase = await prisma.case.update({
      where: { id },
      data: { name, type, content }
    });
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ error: 'Server error or case not found' });
  }
};

export const deleteCase = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.case.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error or case not found' });
  }
};
