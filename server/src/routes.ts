import createRoutes from './utils/createRoutes';
import SheiltaModel, { SheiltaDocument } from './models/sheilta';

const sheiltaRoutes = createRoutes<SheiltaDocument>('sheilta', SheiltaModel);

export default [sheiltaRoutes];
