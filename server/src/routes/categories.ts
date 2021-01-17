import createRoutes from '../utils/createRoutes';
import { Routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';
import CategoryModel, { CategoryDocument } from '../models/category';

const categoriesRoutes = createRoutes<CategoryDocument>(Routes.CATEGORIES, CategoryModel, {
    middleware: verifyToken,
    exclude: ['delete', 'put', 'post'],
    overrides: {
        get: async (req, res) =>
            res.send(
                await CategoryModel.find({ ...req.body })
                    .lean()
                    .populate([
                        {
                            path: 'name',
                            select: 'key'
                        },
                        {
                            path: 'subcategories',
                            populate: {
                                path: 'name',
                                select: 'key'
                            }
                        }
                    ])
            )
    }
});

export default categoriesRoutes;
