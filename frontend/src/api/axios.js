import axios from "axios";

const backend =
  typeof window !== "undefined"
    ? window.__BACKEND_URL__ || "http://localhost:8000"
    : "http://localhost:8000";

const api = axios.create({
  baseURL: backend,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ensure cookies are sent for sanctum CSRF/session authentication
api.defaults.withCredentials = true;

// explicitly set xsrf cookie/header names (axios defaults, but make explicit)
api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

// attach token from localStorage if present
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const myAxios = api;

export const publicAxios = axios.create({
  baseURL: backend,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;