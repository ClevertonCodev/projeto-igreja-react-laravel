import axios from "axios";
import getToken from "./api/Auth/GetToken";

const getBearerToken = async (config) => {
  const token = await getToken(true);
  const newConfig = { ...config };

  if (newConfig.headers) {
    newConfig.headers.Authorization = token;
  }

  return newConfig;
};

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  }
});

api.interceptors.request.use(getBearerToken);

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshTokenValue = await refreshToken();
//       const newRequest = await getBearerToken(originalRequest);
//       if (!newRequest.headers) {
//         newRequest.headers = {};
//       }
//       newRequest.headers.Authorization = refreshTokenValue;
//       const response = await api(newRequest);
//       return response;
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
