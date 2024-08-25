import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
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