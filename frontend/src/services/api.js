// used to make API calls to the backend more clean in the frontend
// Single Responsibility Principle + DRY
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://orderly-api-560m.onrender.com/api',
});
export default api;
