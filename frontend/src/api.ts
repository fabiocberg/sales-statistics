import axios from 'axios';
import { API } from './config';

export const api = axios.create({
  baseURL: API.BASE_URL,
  timeout: 10000,
});

let authToken: string | null = null;

/** Define/limpa o token para o cliente `api`. */
export const setAuthToken = (token?: string | null) => {
  authToken = token ?? null;
  if (authToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/** Interceptor para garantir inclusão do Authorization nas requisições. */
api.interceptors.request.use((config) => {
  if (authToken && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  console.log('baseURL: ', config.baseURL);
  console.log('url: ', config.url);
  console.log('method: ', config.method);
  return config;
});

let unauthorizedHandler: (() => void) | null = null;
/** Define/limpa um handler global para 401 (sessão expirada). */
export const setUnauthorizedHandler = (fn?: () => void) => {
  unauthorizedHandler = fn ?? null;
};

/** Interceptor de resposta para capturar 401 e acionar o handler. */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && unauthorizedHandler) {
      try { unauthorizedHandler(); } catch {}
    }
    return Promise.reject(error);
  }
);
