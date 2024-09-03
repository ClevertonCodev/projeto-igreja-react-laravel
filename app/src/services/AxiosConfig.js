import axios from "axios";
import getToken from "./api/Auth/GetToken";
import Constants from 'expo-constants';
const { extra } = Constants.expoConfig;
const apiUrl = extra.apiUrl;

const getBearerToken = async (config) => {
  const token = await getToken(true);
  const newConfig = { ...config };

  if (newConfig.headers) {
    newConfig.headers.Authorization = token;
  }

  return newConfig;
};

const api = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  }
});

api.interceptors.request.use(getBearerToken);

export default api;
