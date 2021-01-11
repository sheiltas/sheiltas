import axios, { AxiosInstance } from 'axios';
import { Article, Locale, loginObj, methods, routes } from './types';

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
    } catch (e) {
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

const addToken = (axiosInstance: AxiosInstance) => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
    return axiosInstance;
  }
  throw Error('No token');
};

function createApi<T>(
  apiName: routes,
  options: {
    publicApi: Partial<Record<methods, boolean>>;
  } = {
    publicApi: {
      get: false,
      delete: false,
      post: false,
      put: false
    }
  }
) {
  const { publicApi } = options;
  return {
    name: apiName,
    get: async (params: unknown): Promise<T[]> => {
      try {
        if (!publicApi.get) {
          addToken(axiosInstance);
        }
        return (await axiosInstance.get(`/${apiName}`, { params })).data;
      } catch (e) {
        return e;
      }
    },
    post: async (body: Omit<T, '_id'>): Promise<T | string> => {
      try {
        if (!publicApi.post) {
          addToken(axiosInstance);
        }
        return await axiosInstance.post(`${apiName}`, body);
      } catch (e) {
        return e;
      }
    }
  };
}

const articlesApi = createApi<Article>(routes.ARTICLES);

const localesApi = createApi<Locale>(routes.LOCALES, {
  publicApi: {
    get: true
  }
});

export { authApi, articlesApi, localesApi };
