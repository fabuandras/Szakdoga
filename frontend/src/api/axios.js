import axios from "axios";

// Alapértelmezett axios példány a backend hívásokhoz
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// axios v1 cross-origin requests need this to always attach X-XSRF-TOKEN header
api.defaults.withXSRFToken = true;

// explicitly set xsrf cookie/header names (axios defaults, but make explicit)
api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

// attach token from localStorage if present
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Normalize request path to lowercase to avoid 404s from capitalized endpoints
api.interceptors.request.use((config) => {
  if (config && config.url) {
    try {
      const idx = config.url.indexOf("?");
      const path = idx >= 0 ? config.url.substring(0, idx) : config.url;
      const qs = idx >= 0 ? config.url.substring(idx) : "";
      // only lowercase the path part (preserve query string casing)
      config.url = path.toLowerCase() + qs;
    } catch (e) {
      // ignore
    }
  }
  return config;
});

export const myAxios = api;

export const publicAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;