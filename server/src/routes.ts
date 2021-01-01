import * as express from 'express';
import * as bcrypt from 'bcrypt';
import createRoutes, { handleError } from './utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from './models/sheilta';
import ArticleModel, { ArticleDocument } from './models/articles';
import UserModel, { UserDocument } from './models/users';
import { createToken, verifyToken } from './utils/auth';
import { loginObj } from '../../client/src/types';

const router = express.Router();

const createBearerHeader = (authData: string) => `Bearer ${createToken(authData)}`;

router.post('/login', async (req, res) => {
    const { username, password: reqPassword } = req.body as loginObj;
    try {
        const { password: hashedPassword } = await UserModel.findOne({ username });

        return (await bcrypt.compare(reqPassword, hashedPassword))
            ? res.send(createToken(res.locals.authData))
            : res.sendStatus(401);
    } catch (e) {
        handleError(res, e);
    }
});

router.get('/keep-alive', verifyToken, (req, res) => {
    res.set(createBearerHeader(res.locals.authData)).sendStatus(200);
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        await UserModel.create({ username, password, fullName });
        res.status(201).send(`${fullName} created successfully`);
    } catch (e) {
        handleError(res, e);
    }
});

// Add reset password

const sheiltaRoutes = createRoutes<SheiltaDocument>('sheiltas', SheiltaModel);

const articlesRoutes = createRoutes<ArticleDocument>('articles', ArticleModel);

const usersRoutes = createRoutes<UserDocument>('users', UserModel);

export default [usersRoutes, sheiltaRoutes, articlesRoutes, router];
