import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    console.log(token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const setToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setToken,
};
