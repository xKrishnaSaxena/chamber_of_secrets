import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createContent = async (req: Request, res: Response) => {
  const { type, link, title, tags } = req.body;
  try {
    if (req.user) {
      const content = await prisma.content.create({
        data: {
          link,
          type,
          title,
          userId: req.user.id,
          tags: {
            create: tags.map((tagId: string) => ({
              tag: {
                connect: { id: tagId },
              },
            })),
          },
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      if (content.id) {
        res
          .status(200)
          .send({ message: "Content created Successfully!", id: content.id });
      } else {
        res.status(500).send({ message: "Server Error" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
export const getContentByUser = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const contents = await prisma.content.findMany({
        where: { userId: req.user.id },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          user: true,
        },
      });

      res.status(200).json(contents);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contents" });
  }
};
export const deleteContent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.content.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete content" });
  }
};
