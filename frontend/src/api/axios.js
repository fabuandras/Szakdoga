import axios from "axios";

const backend =
  typeof window !== "undefined"
    ? window.__BACKEND_URL__ || "http://localhost:8000"
    : "http://localhost:8000";

const api = axios.create({
  baseURL: `${backend}/api`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

export const myAxios = api;
export default api;