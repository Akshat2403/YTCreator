import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
const prisma = new PrismaClient();


export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    const { authorId, editorId, title } = req.body;
    try {
        const job = await prisma.job.create({
            data: {
                authorId,
                editorId,
                title
            },
        });
        res.status(201).json("Job created successfully.");
    } catch (error) {
        next(error);
    }
}

export const readJob = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const job = await prisma.job.findUnique({
            where: {
                id
            },
        });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        next(error);
    }
}

export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, editorId } = req.body;
    try {
        const job = await prisma.job.update({
            where: {
                id
            },
            data: {
                title,
                editorId,
            },
        });
        res.status(200).json("Job updated successfully.");
    } catch (error) {
        next(error);
    }
}

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const job = await prisma.job.delete({
            where: {
                id
            },
        });
        res.status(200).json("Job deleted successfully.");
    } catch (error) {
        next(error);
    }
}


export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = req.query.authorId as string;
        const userId = req.query.userId as string;

        const jobs = await prisma.job.findMany({
            where: {
                OR: [
                    {
                        authorId: authorId
                    },
                    {
                        editorId: userId
                    }
                ],
            },
            include: {
                author: true,
                editor: true,
            },
        });
        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
}

export const getJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = req.query.authorId as string;
        const editorId = req.query.editorId as string;
        const jobId = req.query.jobId as string;

        if (!jobId || (!authorId && !editorId)) {
            return res.status(400).json({ error: "jobId and either authorId or editorId must be provided" });

        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                authorId: authorId,
                editorId: editorId
            },
            include: {
                author: true,
                editor: true,
            },
        });
        if (!job) {
            return res.status(404).send("Job not found.");
        }

        res.status(200).json(job);

    } catch (error) {
        next(error);
    }
}