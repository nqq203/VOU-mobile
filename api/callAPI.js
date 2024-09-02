import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.5:8080',
  responseType: 'json',
  withCredentials: true,
}
);

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
      config.headers['authorization'] = `Bearer ${token}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);

export default api;