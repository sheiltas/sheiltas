import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const encryptPasswordSync = (rawPassword: string) =>
    bcrypt.hashSync(rawPassword, bcrypt.genSaltSync(10));

export const encryptPassword = (rawPassword: string) => bcrypt.hash(rawPassword, bcrypt.genSaltSync(10));

export const verifyPassword = async (rawPassword: string, encryptedPassword: string) =>
    encryptedPassword === (await encryptPassword(rawPassword));

export const createToken = (username: string) =>
    jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers.authorization?.split(' ') || '';
    if (bearerHeader[0] === 'Bearer') {
        return jwt.verify(bearerHeader[1], process.env.JWT_SECRET, (err, authData) =>
            err ? res.sendStatus(403) : (res.locals.authData = authData && next())
        );
    }
    res.sendStatus(403);
};
