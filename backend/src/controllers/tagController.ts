import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
export const createTag = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const tag = await prisma.tag.create({
      data: { title },
    });
    res.status(201).json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create tag." });
  }
};
export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tags." });
  }
};
