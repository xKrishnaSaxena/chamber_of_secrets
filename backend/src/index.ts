require("dotenv").config();

import { PrismaClient } from "@prisma/client";

import express from "express";

import userRouter from "./routes/userRoutes";

const PORT = process.env.PORT;

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/api/v1/users", userRouter);

app.post("/api/v1/tags", async (req, res) => {
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
app.get("/tags", async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tags." });
  }
});

app.post("/api/v1/content", async (req, res) => {
  const { type, link, title, tags, userId } = req.body;
  try {
    const content = await prisma.content.create({
      data: {
        link,
        type,
        title,
        userId,
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});
app.get("/api/v1/content", async (req, res) => {
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
app.delete("/contents/:id", async (req, res) => {
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

app.post("/api/v1/brain/share", async (req, res) => {
  const share = req.body;
  if (share) {
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
