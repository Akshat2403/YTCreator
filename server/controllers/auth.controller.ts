import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import createError from "../utils/error.ts";
const prisma = new PrismaClient();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return next(createError(404, "User Not Found"));
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(createError(400, "Incorrect Password or Username"));
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRETKEY || "default-secret-key"
    );

    const { password, ...details } = user;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...details });
  } catch (err) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(req.body.password, salt);
  try {
    const userExist = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (userExist) {
      return next(createError(409, "User already exists"));
    }
    if (req.body.role.toLowerCase() in ["creator", "editor"]) {
      console.log(req.body.role);
      return next(createError(400, "Invalid Role"));
    }
    var User;
    if (req.body.role.toLowerCase() === "creator") {
      User = await prisma.creator.create({
        data: {
          user: {
            create: {
              name: req.body.name,
              email: req.body.email,
              password: hash,
            },
          },
        },
      });
    } else {
      User = await prisma.editor.create({
        data: {
          user: {
            create: {
              name: req.body.name,
              email: req.body.email,
              password: hash,
            },
          },
        },
      });
    }
    // const { password, ...otherDetails } = newUser;
    res.status(201).json({ status: "success", data: User });
  } catch (err) {
    next(err);
  }
};
export const logout = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("access_token").end();
};
export const addEditor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
      include: { Editor: true },
    });
    if (!user) {
      next(createError(404, "User not found"));
    }
    if (!user?.Editor) {
      next(createError(404, "Editor not found"));
    }
    const editor = await prisma.editor.update({
      where: { id: user.Editor.id },
      data: {
        creator:{connect:{id:req.body.creatorId}}
      },
    });
  
    res.status(201).json({ status: "success", data: editor });
  } catch (err) {
    next(err);
  }
};
