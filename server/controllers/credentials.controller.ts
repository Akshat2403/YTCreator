import { PrismaClient } from "@prisma/client";
import { encryptData } from "../utils/encryption.js";
import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";
const prisma = new PrismaClient();

export const addCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
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
      return res.status(400).send("Invalid data.");
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

    const newCredentials = await prisma.credentials.create({
      data: {
        key: credEncryptedData,
        Creator: {
          connect: {
            id: user?.Creator?.id,
          }
        },
      },
    });
    res.status(201).json("Credentials added successfully.");
    // console.log(newCredentials);
  } catch (error) {
    next(error);
  }
};

export const updateCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
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
      return res.status(400).send("Invalid data.");
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

    const credential = await prisma.credentials.findFirst({
      where: {
        Creator: {
          id: user?.Creator?.id,
        },
      },
    })

    if (!credential) {
      return res.status(404).send("Credential not found.");
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
    next(error);
  }
};
