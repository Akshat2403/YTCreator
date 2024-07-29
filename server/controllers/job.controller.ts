import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
const prisma = new PrismaClient();


export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uid } = req.params;
        console.log(req.body);
        const { editorId, title, status, additionalComments, ...details } = req.body;
        const job = await prisma.job.create({
            data: {
                author: {
                    connect: {
                        id: uid
                    }
                },
                editor: {
                    connect: {
                        id: editorId
                    }
                },
                title,
                status,
                additionalComments,
                ...details,
            },
        });
        res.status(201).json("Job created successfully.");
    } catch (error) {
        next(error);
    }
}

export const getAllEditors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const editors = await prisma.user.findMany({
            where: {
                roles: "editor"
            },
        });
        res.status(201).json(editors);
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
    const { title, editorId, additionalComments, status, ...details } = req.body;
    try {
        const job = await prisma.job.update({
            where: {
                id
            },
            data: {
                editor: {
                    connect: {
                        id: editorId
                    }
                },
                title,
                status,
                additionalComments,
                ...details,
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
        const { uid } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: uid,
            },
            include: {
                jobs: {
                    select: {
                        id: true,
                        title: true,
                        editorId: true,
                        editor: {
                            select: {
                                name: true,
                            }
                        },
                        createdAt: true,
                        updatedAt: true,
                        additionalComments: true,
                        status: true,
                    }
                },
                editorJobs: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.roles === 'creator') {
            res.status(200).json(user.jobs);
        }
        else {
            res.status(200).json(user.editorJobs);
        }
    } catch (error) {
        next(error);
    }
}

export const getJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobId = req.params.uid;

        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
            },
        });
        if (!job) {
            return res.status(404).send("Job doesn't exist.");
        }

        res.status(200).json(job);

    } catch (error) {
        next(error);
    }
}