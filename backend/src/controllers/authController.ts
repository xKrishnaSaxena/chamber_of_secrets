import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;
const hashPass = async (password: string) => {
  const saltRounds = 10;
  const hashedPass = await bcrypt.hash(password, saltRounds);
  return hashedPass;
};

const signToken = (id: string) => {
  return jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: "15d",
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};
export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body.data;
  //Input validation
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (username.length < 3 || username.length > 10 || !regex.test(password)) {
    res.status(411).send({ message: "Error in Inputs!" });
  }
  //checking already exists
  const userExists = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (userExists) {
    res
      .status(403)
      .send({ message: "User with this username already exists!" });
  }
  const hashedPass = await hashPass(password);

  const response = await prisma.user.create({
    data: {
      username: username,
      password: hashedPass,
    },
  });
  if (response.id) {
    createSendToken(response, 201, res);
  } else {
    res.status(500).send({ message: "Server Error" });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body.data;
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!user) {
    res.status(404).send({ message: "User not Found!" });
  } else {
    try {
      const passMatch = await bcrypt.compare(password, user.password);
      if (passMatch) {
        createSendToken(user, 201, res);
      } else {
        res.status(403).send({ message: "Invalid Credentials!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({ error: "You are not logged in!" });
    }

    const decodedData = jwt.verify(token as string, JWT_SECRET);

    const freshUser = await prisma.user.findFirst({
      where: {
        id: (decodedData as JwtPayload).id,
      },
    });
    if (!freshUser) {
      res.status(401).json({ error: "User does not exist!" });
    }
    if (freshUser) req.user = freshUser;

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token!" });
  }
};
