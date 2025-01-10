require("dotenv").config();

import { PrismaClient } from "@prisma/client";

import express, { Request, Response } from "express";

import userRouter from "./routes/userRoutes";
import { random } from "./utils/utils";
import { protect } from "./controllers/authController";

const PORT = process.env.PORT;

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/api/v1/users", userRouter);

app.post("/api/v1/tags", async (req: Request, res: Response) => {
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
});
app.get("/tags", async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tags." });
  }
});

app.post("/api/v1/content", protect, async (req: Request, res: Response) => {
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
});
app.get("/api/v1/content", protect, async (req: Request, res: Response) => {
  try {
    const contents = await prisma.content.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contents" });
  }
});
app.delete("/contents/:id", protect, async (req: Request, res: Response) => {
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
});

app.post(
  "/api/v1/brain/share",
  protect,
  async (req: Request, res: Response) => {
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
  }
);

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
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
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
