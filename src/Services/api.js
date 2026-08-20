import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://clinica-odontologica-backend-production.up.railway.app/api',
});

// Interceptor de Requisição (envia o JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta (trata retornos HTTP)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Apenas desloga se o token estiver realmente expirado/inválido no servidor
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;