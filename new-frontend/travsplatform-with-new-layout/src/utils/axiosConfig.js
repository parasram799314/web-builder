import axios from "axios";
import { auth } from "../firebase/config";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add the token to the Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // This ensures the token is always fresh (Firebase handles refresh)
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Fallback to localStorage if currentUser is not yet available but token exists
        const localToken = localStorage.getItem("fb_token");
        if (localToken) {
          config.headers.Authorization = `Bearer ${localToken}`;
        }
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
