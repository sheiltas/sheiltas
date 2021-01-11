import * as express from 'express';
import * as bcrypt from 'bcrypt';
import createRoutes, { handleError, handleSuccess } from './utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from './models/sheilta';
import ArticleModel, { ArticleDocument } from './models/articles';
import UserModel, { UserDocument } from './models/users';
import { createToken, verifyToken } from './utils/auth';
import { authData as authDataType, loginObj, routes } from '../../client/src/types';
import { Request, Response } from 'express';
import LocaleModel, { LocaleDocument } from './models/locals';

const router = express.Router();

const createBearerHeader = (authData: authDataType) => `Bearer ${createToken(authData)}`;

router.post(`/${routes.LOGIN}`, async (req, res) => {
    const { username, password: reqPassword } = req.body as loginObj;
    console.log('username', username);
    try {
        const user = await UserModel.findOne({ username });
        const { password: hashedPassword, fullName, _id } = user || {};
        return (await bcrypt.compare(reqPassword, hashedPassword))
            ? res.send(createToken({ fullName, username, _id }))
            : res.sendStatus(401);
    } catch (e) {
        console.log('Error:', e);
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

// Add reset password

const sheiltaRoutes = createRoutes<SheiltaDocument>(routes.SHEILTAS, SheiltaModel, {
    middleware: verifyToken,
    exclude: ['delete']
});

const articlesRoutes = createRoutes<ArticleDocument>(routes.ARTICLES, ArticleModel, {
    middleware: verifyToken,
    exclude: ['delete'],
    overrides: {
        get: async (req, res) => {
            try {
                res.send(await ArticleModel.find({ ...req.body }).populate('author', 'fullName'));
            } catch (e) {
                handleError(res, e);
            }
        }
    }
});
// articlesRoutes.prototype.post =
//     (routes.ARTICLES,
//     verifyToken,
//     async (req: Request, res: Response) => {
//         try {
//             handleSuccess(res, await ArticleModel.create({ ...req.body, author: res.locals.authData._id }));
//         } catch (e) {
//             handleError(res, e);
//         }
//     });
// articlesRoutes.get(routes.ARTICLES, async (req, res) => {
//     try {
//         console.log('res.locals.authData', res.locals.authData);
//         handleSuccess(res, await ArticleModel.find(req.body).populate('author', 'fullName').lean());
//     } catch (e) {
//         handleError(res, e);
//     }
// });

const localesRoutes = createRoutes<LocaleDocument>(routes.LOCALES, LocaleModel, {
    exclude: ['delete', 'post', 'put']
});

const usersRoutes = createRoutes<UserDocument>(routes.USERS, UserModel, {
    exclude: ['delete', 'put']
});

export default [usersRoutes, sheiltaRoutes, articlesRoutes, router, localesRoutes];
