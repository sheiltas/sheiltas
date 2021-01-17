import createRoutes from '../utils/createRoutes';
import UserModel, { UserDocument } from '../models/users';
import { Routes } from '../../../client/src/types';

const usersRoutes = createRoutes<UserDocument>(Routes.USERS, UserModel, {
    exclude: ['delete', 'put']
});

export default usersRoutes;
