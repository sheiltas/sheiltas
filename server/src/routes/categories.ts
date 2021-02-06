import { v4 as uuidv4 } from 'uuid';
import createRoutes from '../utils/createRoutes';
import { Routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';
import CategoryModel, { CategoryDocument } from '../models/category';
import LocaleModel from '../models/locals';
import { languages } from '../../../client/src/utils';

const categoriesRoutes = createRoutes<CategoryDocument>(Routes.CATEGORIES, CategoryModel, {
    middleware: verifyToken,
    exclude: ['delete', 'put'],
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
            ),
        post: async (req, res) => {
            const { word } = req.body;
            if (!word) {
                throw `Missing info: word: ${word}`;
            }

            const locale = new LocaleModel({
                key: uuidv4(),
                translation: languages.reduce(
                    (acc, language) => ({
                        ...acc,
                        [language]: word
                    }),
                    {}
                )
            });

            const category = new CategoryModel({
                name: locale._id
            });

            const response = await Promise.all([
                category
                    .save()
                    .then(
                        async (categoryRes) =>
                            await CategoryModel.populate(categoryRes, { path: 'name', select: 'key' })
                    ),
                locale.save()
            ]);

            res.send(response);
        }
    }
});

export default categoriesRoutes;
