import axios from "axios";
import { BASE_URL } from "./apiPaths";
 const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

 //request interceptors
  axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem("token");
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  }
);

//response interceptors
axiosInstance.interceptors.response.use(function onFulfilled(response) {
    return response;
  }, function onRejected(error) {
    if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  });

  export default axiosInstance;