// src/utils/api.js
import axios from 'axios';

const apiSpring = axios.create({
    baseURL: 'http://127.0.0.1:9090/', 
    withCredentials: true, // Enable sending cookies with requests
    // maxRedirects: 0
});

export default apiSpring;
