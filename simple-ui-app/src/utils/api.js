// src/utils/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:4433', 
    withCredentials: true, // Enable sending cookies with requests
});

export default api;
