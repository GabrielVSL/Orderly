// used to make API calls to the backend more clean in the frontend
// Single Responsibility Principle + DRY
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});
export default api;