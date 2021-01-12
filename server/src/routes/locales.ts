import createRoutes from '../utils/createRoutes';
import LocaleModel, { LocaleDocument } from '../models/locals';
import { routes } from '../../../client/src/types';

const localesRoutes = createRoutes<LocaleDocument>(routes.LOCALES, LocaleModel, {
    exclude: ['delete', 'post', 'put']
});

export default localesRoutes;
