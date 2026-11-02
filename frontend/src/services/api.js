import axios from 'axios';

const SESSION_STORAGE_KEY = 'orderly_session_id';
const TOKEN_KEY = 'patties_auth_token';

export const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return 'guest-session';
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = 'sess_' + crypto.randomUUID();
    } else {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    }
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};

// Determina dinamicamente a URL base
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Em desenvolvimento local, usa o servidor local na porta 3001
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }
  return 'https://orderly-api-560m.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

// Interceptor injeta x-session-id e Bearer Token de autenticação
api.interceptors.request.use(
  (config) => {
    const sessionId = getOrCreateSessionId();
    config.headers['x-session-id'] = sessionId;

    // Se houver usuário logado, anexa o token JWT
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
