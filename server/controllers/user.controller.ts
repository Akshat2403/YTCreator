import { PrismaClient } from '@prisma/client';
import { encryptData } from '../utils/encryption.js';
import type { NextFunction, Request, Response } from "express";
import crypto from 'crypto';
const prisma = new PrismaClient();

export const addCredentials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const credData = req.file.buffer.toString('utf8');
        const secret_key = req.body.secret_key;
        const secret_iv = crypto.randomBytes(16).toString('hex');
        const ecnryption_method = 'aes-256-cbc';
        const credEncryptedData = encryptData(credData, secret_key, secret_iv, ecnryption_method);

        if (!credData || !secret_key) {
            return res.status(400).send('Invalid data.');

        }

        const newCredentials = await prisma.credentials.create({
            data: {
                author: {
                    connect: { id: req.body.author_id }
                },
                key: credEncryptedData,
            }
        })
        res.status(201).json("Credentials added successfully.");
        // console.log(newCredentials);
    } catch (error) {
        next(error);
    }
}

export const updateCredentials = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const credData = req.file.buffer.toString('utf8');
        const secret_key = req.body.secret_key;
        const secret_iv = crypto.randomBytes(16).toString('hex');
        const ecnryption_method = 'aes-256-cbc';
        const credEncryptedData = encryptData(credData, secret_key, secret_iv, ecnryption_method);

        if (!credData || !secret_key) {
            return res.status(400).send('Invalid data.');
        }

        const credential = await prisma.credentials.findFirst({
            where: {
                authorId: req.body.author_id
            }
        });

        if (!credential) {
            return res.status(404).send('Credential not found.');
        }


        const updatedCredentials = await prisma.credentials.update({
            where: {
                id: credential.id
            },
            data: {
                key: credEncryptedData,
                updatedAt: new Date(),
            }
        });

        res.status(201).json("Credentials updated successfully.");
        // console.log(updatedCredentials);
        // console.log(decryptData(updatedCredentials.key, "sad", secret_iv, ecnryption_method));

    } catch (error) {
        next(error);
    }
}

export const createUser = async (req: Request, res: Response) => {
    // console.log("Request body:", req.body);
    const { email, name, password, roles } = req.body;

    if (!email || !name || !password || !roles) {
        res.status(400).send('Email, name, password, and roles are required.');
    }


    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password,
                roles
            }
        })
        res.status(201).json("User created successfully.");
        // console.log(user);
    } catch (error) {
        console.error(error);
    }
}

export const updateUser = async (req: Request, res: Response) => {
    // console.log("Request body:", req.body);
    const { id, email, name, password, roles } = req.body;

    if (!id) {
        res.status(400).send('Login required.');
    }

    if (!email || !name || !password || !roles) {
        res.status(400).send('Email, name, password, and roles are required.');
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                name,
                password,
                roles
            }
        });
        res.json("User updated successfully.");
        // console.log(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the user.');
    }
};
