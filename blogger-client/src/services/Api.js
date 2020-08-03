import axios from "axios";

export default () => {
  let token = window.localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer:${token}`;
  return axios.create({
    baseURL: process.env.VUE_APP_BASEURL
  });
};
