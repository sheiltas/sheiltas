import createRoutes from '../utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from '../models/sheilta';
import { routes } from '../../../client/src/types';
import { verifyToken } from '../utils/auth';

const sheiltaRoutes = createRoutes<SheiltaDocument>(routes.SHEILTAS, SheiltaModel, {
    middleware: verifyToken,
    exclude: ['delete']
});

export default sheiltaRoutes;
