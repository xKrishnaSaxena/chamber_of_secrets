import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { random } from "../utils/utils";
const prisma = new PrismaClient();
export const makeShareable = async (req: Request, res: Response) => {
  const share = req.body.share;
  if (req.user) {
    if (share) {
      const existingLink = await prisma.shareableLink.findFirst({
        where: {
          userId: req.user.id,
        },
      });

      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
        return;
      }
      const hash = random(8);
      await prisma.shareableLink.create({
        data: {
          userId: req.user.id,
          hash: hash,
        },
      });

      res.json({
        hash,
      });
    } else {
      await prisma.shareableLink.deleteMany({
        where: {
          userId: req.user.id,
        },
      });

      res.json({
        message: "Removed link",
      });
    }
  }
};

export const shareLink = async (req: Request, res: Response) => {
  const hash = req.params.shareLink;

  const link = await prisma.shareableLink.findFirst({
    where: {
      hash,
    },
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }
  const content = await prisma.shareableLink.findFirst({
    where: {
      userId: link.userId,
    },
  });

  console.log(link);
  const user = await prisma.user.findFirst({
    where: {
      id: link.userId,
    },
  });

  if (!user) {
    res.status(411).json({
      message: "user not found, error should ideally not happen",
    });
    return;
  }

  res.json({
    username: user.username,
    content: content,
  });
};
