import createRoutes from '../utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from '../models/sheilta';
import { Routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';

const sheiltaRoutes = createRoutes<SheiltaDocument>(Routes.SHEILTAS, SheiltaModel, {
    middleware: verifyToken,
    exclude: ['delete'],
    overrides: {
        get: async (req, res) => {
            res.send(
                await SheiltaModel.find({ ...req.body })
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
            );
        }
    }
});

export default sheiltaRoutes;
