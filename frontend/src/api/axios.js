// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api", // backend url
//   withCredentials: true // cookies / jwt
// });

// // const api = axios.create({
// //   baseURL: import.meta.env.VITE_API_URL,
// //   withCredentials: true,
// // });

// export default api;


// deploy

import axios from "axios";

const api = axios.create({
  // backend ka live url rebder pr
  baseURL: "https://real-time-chat-application-with-memory-bt70.onrender.com/api",
  withCredentials: true,
});

export default api;
