// used to make API calls to the backend more clean in the frontend
// Single Responsibility Principle + DRY
import axios from 'axios';
const api = axios.create({
  baseURL: 'https://onlineordersystem-1lm5.onrender.com/api',
});
export default api;