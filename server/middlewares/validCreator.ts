//middleware for checking the user is an creator or not
import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
const prisma = new PrismaClient();

export const validateCreatorRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.params)
        const { uid } = req.params;
        if (!uid) {
            return res.status(400).json({ error: 'creator ID is required' });
        }
        const creator = await prisma.user.findUnique({
            where: {
                id: uid
            }
        });

        if (!creator || creator.roles !== 'creator') {
            return res.status(400).json({ error: 'Invalid creator role' });
        }
        next();
    } catch (error) {
        next(error);
    }
}