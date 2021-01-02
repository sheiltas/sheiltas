import axios from 'axios';
import { loginObj, routes } from './types';
import { Article } from '../../server/src/models/articles';

const axiosInstance = axios.create({
  // baseURL: `/api` should be this when server serves the site
  baseURL: `http://localhost:4000/api`
});

const authApi = {
  login: async (loginData: loginObj) => {
    try {
      const { data: token } = await axiosInstance.post(
        `/${routes.LOGIN}`,
        loginData
      );
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.authorization = token;
      return true;
    } catch (e) {
      // console.log('e', e);
      return false;
    }
  },
  keepAlive: async () => {
    try {
      const { data: token } = await axiosInstance.get(`/${routes.KEEP_ALIVE}`);
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.authorization = token;
    } catch (e) {
      console.log('e', e);
      return e;
    }
  }
};

function createApi<T>(apiName: routes) {
  return {
    name: apiName,
    get: (params: unknown) => axiosInstance.get(`/${apiName}`, { params }),
    post: (body: Omit<T, '_id'>) => axiosInstance.post(`${apiName}`, body)
  };
}

const articlesApi = createApi<Article>(routes.ARTICLES);

export { authApi, articlesApi };
