import axios from "axios";

export const myAxios = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

myAxios.interceptors.request.use((config) => {
  // Laravel Sanctum XSRF cookie neve: XSRF-TOKEN
  const xsrf = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (xsrf) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrf);
  }

  return config;
});

export default myAxios;