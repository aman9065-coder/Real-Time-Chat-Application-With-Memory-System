import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // backend url
  withCredentials: true // cookies / jwt
});

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

export default api;
