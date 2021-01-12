import createRoutes, { handleError } from '../utils/createRoutes';
import ArticleModel, { ArticleDocument } from '../models/articles';
import { routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';

const articlesRoutes = createRoutes<ArticleDocument>(routes.ARTICLES, ArticleModel, {
    middleware: verifyToken,
    exclude: ['delete'],
    overrides: {
        get: async (req, res) => {
            console.log('gothete');
            try {
                res.send(
                    await ArticleModel.find({ ...req.body }).populate([
                        { path: 'author', select: 'fullName' }
                    ])
                );
            } catch (e) {
                handleError(res, e);
            }
        }
    }
});

export default articlesRoutes;
