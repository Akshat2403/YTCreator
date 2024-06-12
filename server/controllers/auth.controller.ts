import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import type { Request,Response,NextFunction } from 'express';
import createError from '../utils/error.ts';
const prisma = new PrismaClient();

export const login = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            return next(createError(404, 'User Not Found'));
        }

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect) {
            return next(createError(400, 'Incorrect Password or Username'));
        }
        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRETKEY || 'default-secret-key'
        );

        const { password, ...details } = user;
        res.cookie('access_token', token, {
            httpOnly: true,
        })
            .status(200)
            .json({ ...details });
    } catch (err) {
        next(err);
    }
};

export const register = async (req:Request, res:Response, next:NextFunction) => {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(req.body.password, salt);
    try {
        const userExist = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        if (userExist) {
            return next(createError(409, 'User already exists'));
        }
        if (!(req.body.roles in ["creator", "editor"])) {
            return next(createError(400, 'Invalid Role'));
        }
        const newUser = await prisma.user.create({
            data: {
                ...req.body,
                password: hash,
            },
        });
        const { password, ...otherDetails } = newUser;
        res.status(201).json({ ...otherDetails });
    } catch (err) {
        next(err);
    }
};
export const logout = (req:Request, res:Response, next:NextFunction) => {
    res.clearCookie('access_token').end();
};
