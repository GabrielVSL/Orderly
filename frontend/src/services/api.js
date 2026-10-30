import axios from 'axios';

const SESSION_STORAGE_KEY = 'orderly_session_id';

export const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return 'guest-session';
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://orderly-api-560m.onrender.com/api',
});

// Interceptor injeta automaticamente o x-session-id para isolamento multiusuário
api.interceptors.request.use(
  (config) => {
    const sessionId = getOrCreateSessionId();
    config.headers['x-session-id'] = sessionId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
