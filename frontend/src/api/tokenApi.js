import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

// inject header from localStorage
// API.interceptors.request.use((config) => {
//   const nb = localStorage.getItem("notifyBefore");
//   if (nb) config.headers["X-Notify-Before"] = nb;
//   return config;
// });

export const addToken = (data) => API.post("/tokens", data);

export const getTokens = () => API.get("/tokens");

export const serveToken = (id) => API.put(`/tokens/${id}/serve`);

export const skipToken = (id) => API.put(`/tokens/${id}/skip`);

export const deleteToken = (id) => API.delete(`/tokens/${id}`);
