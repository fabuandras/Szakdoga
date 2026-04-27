import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// attach CSRF token if present in DOM (Laravel setups)
const tokenMeta =
  typeof document !== "undefined" && document.head
    ? document.head.querySelector('meta[name="csrf-token"]')
    : null;
if (tokenMeta) {
  api.defaults.headers["X-CSRF-TOKEN"] = tokenMeta.content;
}

export default api;