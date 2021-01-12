import createRoutes from '../utils/createRoutes';
import UserModel, { UserDocument } from '../models/users';
import { routes } from '../../../client/src/types';

const usersRoutes = createRoutes<UserDocument>(routes.USERS, UserModel, {
    exclude: ['delete', 'put']
});

export default usersRoutes;
