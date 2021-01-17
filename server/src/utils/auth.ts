import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AuthData as authDataType } from '../../../client/src/types';

export const encryptPasswordSync = (rawPassword: string) =>
    bcrypt.hashSync(rawPassword, bcrypt.genSaltSync(10));

export const encryptPassword = (rawPassword: string) => bcrypt.hash(rawPassword, bcrypt.genSaltSync(10));

export const verifyPassword = async (rawPassword: string, encryptedPassword: string) =>
    encryptedPassword === (await encryptPassword(rawPassword));

export const createToken = (authData: authDataType) =>
    jwt.sign(authData, process.env.JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers.authorization?.split(' ') || '';
    if (bearerHeader[0] === 'Bearer') {
        return jwt.verify(bearerHeader[1], process.env.JWT_SECRET, (err, authData) => {
            // console.log('authData', authData);
            res.locals.authData = authData;
            return err ? res.sendStatus(403) : next();
        });
    }
    res.sendStatus(403);
};
