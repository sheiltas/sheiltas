import createRoutes from '../utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from '../models/sheilta';
import { Routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';

const sheiltaRoutes = createRoutes<SheiltaDocument>(Routes.SHEILTAS, SheiltaModel, {
    middleware: verifyToken,
    exclude: ['delete']
});

export default sheiltaRoutes;
