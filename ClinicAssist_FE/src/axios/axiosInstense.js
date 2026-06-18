import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5062",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    const status = response.status;
    const message = response.data?.message;
    const method = response.config.method?.toLowerCase();

    if (status >= 200 && status < 300 && method !== "get") {
      if (message) {
        toast.success(message);
      }
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;