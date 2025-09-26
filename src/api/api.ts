import axios from "axios";

const api = axios.create({
  baseURL: "https://express-service-app-zejj.onrender.com",
  timeout: 10000,
});

export default api;
