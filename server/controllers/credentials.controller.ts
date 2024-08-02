import { PrismaClient } from "@prisma/client";
import { encryptData } from "../utils/encryption.js";
import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import createError from "../utils/error.js";
const prisma = new PrismaClient();

export const addCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(createError(400, "No File Uploaded"));
    }
    const credData = req.file.buffer.toString("utf8");
    const secret_key = req.body.secret_key;
    const secret_iv = process.env.SECRET_IV ?? "default_secret_iv";
    const encryption_method = "aes-256-cbc";
    const credEncryptedData = encryptData(
      credData,
      secret_key,
      secret_iv,
      encryption_method
    );

    if (!credData || !secret_key) {
      return next(createError(400, "Invalid Data"));
    }

    // const newCredentials = await prisma.credentials.create({
    //   data: {
    //     User: {
    //       connect: { id: req.params.uid },
    //     },
    //     key: credEncryptedData,
    //   },
    // });
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.uid,
      },
      include: {
        Creator: true,
      },
    });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const newCredentials = await prisma.credentials.create({
      data: {
        key: credEncryptedData,
        Creator: {
          connect: {
            id: user?.Creator?.id,
          },
        },
      },
    });
    res.status(201).json("Credentials added successfully.");
    // console.log(newCredentials);
  } catch (error) {
    next(createError(500, "Error adding Credentials"));
  }
};

export const updateCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(createError(400, "No File Uploaded"));
    }

    const credData = req.file.buffer.toString("utf8");
    const secret_key = req.body.secret_key;
    const secret_iv = process.env.SECRET_IV ?? "default_secret_iv";
    const encryption_method = "aes-256-cbc";
    const credEncryptedData = encryptData(
      credData,
      secret_key,
      secret_iv,
      encryption_method
    );

    if (!credData || !secret_key) {
      return next(createError(400, "Invalid Data"));
    }

    // const credential = await prisma.credentials.findFirst({
    //   where: {
    //     User: {
    //       id: req.body.author_id,
    //     },
    //   },
    // });

    // if (!credential) {
    //   return res.status(404).send("Credential not found.");
    // }

    const user = await prisma.user.findUnique({
      where: {
        id: req.params.uid,
      },
      include: {
        Creator: true,
      },
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const credential = await prisma.credentials.findFirst({
      where: {
        Creator: {
          id: user?.Creator?.id,
        },
      },
    });

    if (!credential) {
      return next(createError(404, "Credential not found"));
    }

    // const updatedCredentials = await prisma.credentials.update({
    //   where: {
    //     id: credential.id,
    //   },
    //   data: {
    //     key: credEncryptedData,
    //   },
    // });

    const updatedCredentials = await prisma.credentials.update({
      where: {
        id: credential.id,
      },
      data: {
        key: credEncryptedData,
      },
    });

    res.status(201).json("Credentials updated successfully.");
    // console.log(updatedCredentials);
    // console.log(decryptData(updatedCredentials.key, "sad", secret_iv, ecnryption_method));
  } catch (error) {
    next(createError(500, "Error Upadting Credentials"));
  }
};
