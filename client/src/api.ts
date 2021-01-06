import axios from 'axios';
import { loginObj, routes } from './types';
import { Article } from './types';

const baseURL =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api';

const axiosInstance = axios.create({
  baseURL
});

const authApi = {
  login: async (loginData: loginObj): Promise<string | boolean> => {
    try {
      const { data: token } = await axiosInstance.post(
        `/${routes.LOGIN}`,
        loginData
      );
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.authorization = token;
      return token;
      // return true;
    } catch (e) {
      // console.log('e', e);
      return false;
    }
  },
  keepAlive: async () => {
    try {
      const { data: token } = await axiosInstance.get(`/${routes.KEEP_ALIVE}`);
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
    } catch (e) {
      console.log('e', e);
      return e;
    }
  }
};

function createApi<T>(apiName: routes) {
  return {
    name: apiName,
    get: async (params: unknown) =>
      await axiosInstance.get(`/${apiName}`, { params }),
    post: async (body: Omit<T, '_id'>) => {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
        try {
          return await axiosInstance.post(`${apiName}`, body);
        } catch (e) {
          return e;
        }
      }
    }
  };
}

const articlesApi = createApi<Article>(routes.ARTICLES);

export { authApi, articlesApi };
