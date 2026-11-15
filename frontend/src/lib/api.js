import axios from 'axios';

export const api = axios.create({
  // Domyślny adres lokalnego serwera FastAPI
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  // To ustawienie usuwa nawiasy [] z parametrów wysyłanych jako tablice
  paramsSerializer: {
    indexes: null
  }
});