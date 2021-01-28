import axios, { AxiosInstance } from 'axios';
import {
  Article,
  ClientArticle,
  ClientCategory,
  ClientSheilta,
  Locale,
  LoginObj,
  Methods,
  Routes,
  Sheilta
} from './types';

const baseURL =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api';

const axiosInstance = axios.create({
  baseURL
});

const authApi = {
  login: async (loginData: LoginObj): Promise<string | boolean> => {
    try {
      const { data: token } = await axiosInstance.post(
        `/${Routes.LOGIN}`,
        loginData
      );
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.authorization = token;
      return token;
    } catch (e) {
      return false;
    }
  },
  keepAlive: async (): Promise<boolean> => {
    try {
      const { data: token } = await axiosInstance.get(`/${Routes.KEEP_ALIVE}`);
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
      return true;
    } catch (e) {
      // console.log('e', e);
      return false;
    }
  }
};

const addToken = (axiosInstanceArg: AxiosInstance) => {
  const token = localStorage.getItem('token');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    axiosInstanceArg.defaults.headers.authorization = `Bearer ${token}`;
    return axiosInstanceArg;
  }
  throw Error('No token');
};

function createApi<T, GetOverride = T>(
  apiName: Routes,
  options: {
    publicApi: Partial<Record<Methods, boolean>>;
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
    get: async (params: unknown): Promise<GetOverride[]> => {
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
        return await axiosInstance.post(`/${apiName}`, body);
      } catch (e) {
        return e;
      }
    },
    put: async (body: T): Promise<T | string> => {
      try {
        if (!publicApi.put) {
          addToken(axiosInstance);
        }
        return await axiosInstance.put(`/${apiName}`, body);
      } catch (e) {
        return e;
      }
    }
  };
}

const articlesApi = createApi<Article, ClientArticle>(Routes.ARTICLES);

const sheiltasApi = createApi<Sheilta, ClientSheilta>(Routes.SHEILTAS);

const localesApi = createApi<Locale>(Routes.LOCALES, {
  publicApi: {
    get: true
  }
});

const categoriesApi = createApi<ClientCategory>(Routes.CATEGORIES);

export { authApi, articlesApi, localesApi, categoriesApi, sheiltasApi };
