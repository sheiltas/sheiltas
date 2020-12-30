import axios from 'axios';
import { loginObj } from '../../types';

const axiosInstance = axios.create({
  // baseURL: `${process.env.BASE_REQUEST_URL}/api`
  baseURL: `http://localhost:4000/api`
});

const login = async (loginData: loginObj) => {
  try {
    const { data: token } = await axiosInstance.post('/login', loginData);
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.authorization = token;
    return true;
  } catch (e) {
    console.log('e', e);
    return false;
  }
};

const keepAlive = async () => {
  try {
    const { data: token } = await axiosInstance.get('/keep-alive');
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.authorization = token;
  } catch (e) {
    return e;
  }
};

function createApi<T>(apiName: string) {
  return {
    name: apiName,
    get: (params: unknown) => axiosInstance.get(`/${apiName}`, { params })
  };
}

// const articlesApi = createApi();

export { login, keepAlive };
