// import { Alert } from 'react-native';

// const apiBaseUrl = 'http://localhost:8080'; // Thay thế bằng URL của bạn

// export const apiCall = async (endpoint, options) => {
//   try {
//     const response = await fetch(`${apiBaseUrl}/${endpoint}`, options);
//     const data = await response.json();

//     console.log('API response:', data);
//     if (!response.ok) {
//       throw new Error(data.message || 'Something went wrong');
//     }

//     return data;
//   } catch (error) {
//     showError(error.message || 'An unexpected error occurred');
//     throw error;
//   }
// };

// const showError = (message) => {
//   Alert.alert('Error', message);
// };
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
}
);

api.interceptors.request.use(
  config => {
    config.headers['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;