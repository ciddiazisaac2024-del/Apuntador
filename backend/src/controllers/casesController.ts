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
    console.error('Error in getCases:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCase = async (req: Request, res: Response) => {
  try {
    const { name, type, content } = req.body;
    
    const createdById = req.user!.id; // from auth middleware

    const newCase = await prisma.case.create({
      data: { name, type, content, createdById }
    });
    res.status(201).json(newCase);
  } catch (error: any) {
    console.error('Error in createCase:', error);
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
  } catch (error: any) {
    console.error('Error in updateCase:', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'A case with this name already exists' });
    }
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCase = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.case.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error: any) {
    console.error('Error in deleteCase:', error);
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
