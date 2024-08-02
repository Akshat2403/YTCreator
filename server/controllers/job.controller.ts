import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import createError from "../utils/error";
const prisma = new PrismaClient();


export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { uid } = req.params;
        // console.log(req.params);
        const { editorId, title, status, additionalComments, ...details } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            include: {
                Creator: true
            }
        })

        if (!user) {
            return next(createError(404, "User not found"));
        }

        const job = await prisma.job.create({
            data: {
                Creator: {
                    connect: {
                        id: user.Creator.id
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
        next(createError(500, "Error Creating Job"));
    }
}

export const getAllEditors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            include: {
                Creator: {
                    include: {
                        editors: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return next(createError(404, "User not found"));
        }

        const editors = user?.Creator.editors;

        res.status(201).json(editors);
    } catch (error) {
        next(createError(500, "Error Fetching Editors"));
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
            return next(createError(404, "Job not found"));
        }
        res.status(200).json(job);
    } catch (error) {
        next(createError(500, "Error Fetching Job"));
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
        if (!job) {
            return next(createError(404, "Job not found"));
        }
        res.status(200).json("Job updated successfully.");
    } catch (error) {
        next(createError(500, "Error Updating Job"));
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
        if (!job) {
            return next(createError(404, "Job not found"));
        }
        res.status(200).json("Job deleted successfully.");
    } catch (error) {
        next(createError(500, "Error Deleting Job"));
    }
}


export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            include: {
                Creator: {
                    include: {
                        jobs: {
                            include: {
                                editor: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                    },
                },
                Editor: {
                    include: {
                        Job: {
                            include: {
                                Creator: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            return next(createError(404, "User not found"));;
        }
        
        // res.status(200).json(user);

        if (user.Creator !== null) {
            res.status(200).json(user.Creator.jobs);
        }
        else {
            res.status(200).json(user.Editor?.Job);
        }
    } catch (error) {
        next(createError(500, "Error Fetching Jobs"));
    }
}

// export const getJob = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const jobId = req.params.uid;

//         const job = await prisma.job.findFirst({
//             where: {
//                 id: jobId,
//             },
//         });
//         if (!job) {
//             return res.status(404).send("Job doesn't exist.");
//         }

//         res.status(200).json(job);

//     } catch (error) {
//         next(error);
//     }
// }