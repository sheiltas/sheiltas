import createRoutes, { handleError } from '../utils/createRoutes';
import ArticleModel, { ArticleDocument } from '../models/articles';
import { routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';

const articlesRoutes = createRoutes<ArticleDocument>(routes.ARTICLES, ArticleModel, {
    middleware: verifyToken,
    exclude: ['delete'],
    overrides: {
        get: async (req, res) =>
            res.send(
                await ArticleModel.find({ ...req.body })
                    .lean()
                    .populate([
                        { path: 'author', select: 'fullName' },
                        {
                            path: 'category',
                            populate: {
                                path: 'name',
                                select: 'key'
                            }
                        },
                        {
                            path: 'subcategory',
                            populate: {
                                path: 'name',
                                select: 'key'
                            }
                        }
                    ])
            )
    }
});

export default articlesRoutes;
