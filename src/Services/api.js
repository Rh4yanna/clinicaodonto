import axios from 'axios';

const isPublicAuth = (config) => /\/auth\/(login|recuperar-senha|redefinir-senha)\/?$/.test(config?.url || '');

const api = axios.create({
  timeout: 20000,
  baseURL: import.meta.env.VITE_API_URL || 'https://clinica-odontologica-backend-production.up.railway.app/api',
});

// Interceptor de Requisição (envia o JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !isPublicAuth(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta (trata retornos HTTP)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Apenas desloga se o token estiver realmente expirado/inválido no servidor
    if (error.response && error.response.status === 401 && !isPublicAuth(error.config)) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
