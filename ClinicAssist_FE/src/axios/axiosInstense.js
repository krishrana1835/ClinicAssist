import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5062",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;