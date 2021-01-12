import * as express from 'express';
import { authData as authDataType, loginObj, routes } from '../../../client/src/types';
import { createToken, verifyToken } from '../utils/auth';
import UserModel from '../models/users';
import * as bcrypt from 'bcrypt';
import { handleError } from '../utils/createRoutes';

const router = express.Router();

const createBearerHeader = (authData: authDataType) => `Bearer ${createToken(authData)}`;

router.post(`/${routes.LOGIN}`, async (req, res) => {
    const { username, password: reqPassword } = req.body as loginObj;
    try {
        const user = await UserModel.findOne({ username });
        const { password: hashedPassword, fullName, _id } = user || {};
        return (await bcrypt.compare(reqPassword, hashedPassword))
            ? res.send(createToken({ fullName, username, _id }))
            : res.sendStatus(401);
    } catch (e) {
        handleError(res, e);
    }
});

router.get(`/${routes.KEEP_ALIVE}`, verifyToken, (req, res) => {
    res.set(createBearerHeader(res.locals.authData)).sendStatus(200);
});

router.post(`/${routes.SIGNUP}`, async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        await UserModel.create({ username, password, fullName });
        res.status(201).send(`${fullName} created successfully`);
    } catch (e) {
        handleError(res, e);
    }
});

export default router;
