import createRoutes from '../utils/createRoutes';
import LocaleModel, { LocaleDocument } from '../models/locals';
import { Routes } from '../../../client/src/types';

const localesRoutes = createRoutes<LocaleDocument>(Routes.LOCALES, LocaleModel, {
    exclude: ['delete', 'post', 'put']
});

export default localesRoutes;
