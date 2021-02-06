import { v4 as uuidv4 } from 'uuid';
import createRoutes from '../utils/createRoutes';
import { Routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';
import LocaleModel from '../models/locals';
import { languages } from '../../../client/src/utils';
import SubcategoryModel, { SubcategoryDocument } from '../models/subcategory';
import CategoryModel from '../models/category';

const categoriesRoutes = createRoutes<SubcategoryDocument>(Routes.SUBCATEGORIES, SubcategoryModel, {
    middleware: verifyToken,
    exclude: ['delete', 'put', 'get'],
    overrides: {
        post: async (req, res) => {
            const { word, categoryId } = req.body;

            if (!word || !categoryId) {
                throw `Missing info: word: ${word}, categoryId: ${categoryId}`;
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

            const subcategory = new SubcategoryModel({
                name: locale._id
            });
            const response = await Promise.all([
                subcategory
                    .save()
                    .then(
                        async (subcategoryRes) =>
                            await SubcategoryModel.populate(subcategoryRes, { path: 'name', select: 'key' })
                    ),
                locale.save(),
                CategoryModel.findOneAndUpdate(
                    {
                        _id: categoryId
                    },
                    {
                        $push: { subcategories: subcategory._id }
                    }
                )
            ]);

            res.send(response);
        }
    }
});

export default categoriesRoutes;
