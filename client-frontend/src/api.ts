import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adres Twojego backendu
});

export default API;