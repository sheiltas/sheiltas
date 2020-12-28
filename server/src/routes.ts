import * as express from 'express';
import createRoutes from './utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from './models/sheilta';
import ArticleModel, { ArticleDocument } from './models/articles';
import UserModel, { UserDocument } from './models/users';
import { createToken, verifyToken } from './utils/auth';
import { debuglog } from 'util';

const router = express.Router();

interface loginObj {
    username: string;
    password: string;
}

const createBearerHeader = (authData: string) => `Bearer ${createToken(authData)}`;

router.post('/login', (req, res) => {
    console.log('req.body', req.body);
    const { username, password } = req.body as loginObj;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        res.set('authorization', createToken(res.locals.authData)).sendStatus(200);
        console.debug('');
    }
    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
        ? res.status(200).send(createToken(username))
        : res.sendStatus(401);
});

router.get('/keep-alive', verifyToken, (req, res) => {
    // res.set('authorization', createToken(res.locals.authData)).sendStatus(200);
    res.set(createBearerHeader(res.locals.authData)).send('keep-alive');
});

const sheiltaRoutes = createRoutes<SheiltaDocument>('sheiltas', SheiltaModel);

const articlesRoutes = createRoutes<ArticleDocument>('articles', ArticleModel);

const usersRoutes = createRoutes<UserDocument>('users', UserModel);

export default [usersRoutes, sheiltaRoutes, articlesRoutes, router];
