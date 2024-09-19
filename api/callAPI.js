// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.10.11:8080',
  responseType: 'json',
  withCredentials: true,
}
);

api.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync('token');
    config.headers['authorization'] = `Bearer ${token}`;
        return config;
    },
    error => {
      return Promise.reject(error);
    }
);

export default api;