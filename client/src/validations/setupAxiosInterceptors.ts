import axios from "axios";
import { store } from "../store";

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const accessToken = state.auth.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default setupAxiosInterceptors;


// r to attach accessToken to all API requests.