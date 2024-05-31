import axios from "axios";
const GITHUB_TOKEN = process.env.REACT_APP_GIT_API_KEY;
const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});

export default axiosInstance;
