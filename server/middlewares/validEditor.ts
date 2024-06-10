//middleware for checking the user is an editor or not
import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
const prisma = new PrismaClient();

export const validateEditorRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { editorId } = req.body;
        if (!editorId) {
            return res.status(400).json({ error: 'Editor ID is required' });
        }
        const editor = await prisma.user.findUnique({
            where: {
                id: editorId
            }
        });

        if (!editor || editor.roles !== 'editor') {
            return res.status(400).json({ error: 'Invalid editor role' });
        }
        next();
    } catch (error) {
        next(error);
    }
}