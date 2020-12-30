import * as express from 'express';
import createRoutes from './utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from './models/sheilta';
import ArticleModel, { ArticleDocument } from './models/articles';
import UserModel, { UserDocument } from './models/users';
import { createToken, verifyToken } from './utils/auth';
import { loginObj } from '../../types';

const router = express.Router();

const createBearerHeader = (authData: string) => `Bearer ${createToken(authData)}`;

// Change logic to work for more users
router.post('/login', (req, res) => {
    const { username, password } = req.body as loginObj;
    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
        ? res.send(createToken(res.locals.authData))
        : res.sendStatus(401);
});

router.get('/keep-alive', verifyToken, (req, res) => {
    res.set(createBearerHeader(res.locals.authData)).sendStatus(200);
});

// Add reset password

const sheiltaRoutes = createRoutes<SheiltaDocument>('sheiltas', SheiltaModel);

const articlesRoutes = createRoutes<ArticleDocument>('articles', ArticleModel);

const usersRoutes = createRoutes<UserDocument>('users', UserModel);

export default [usersRoutes, sheiltaRoutes, articlesRoutes, router];
