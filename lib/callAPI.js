import { Alert } from 'react-native';

const apiBaseUrl = ''; // Thay thế bằng URL của bạn

export const apiCall = async (endpoint, options) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    showError(error.message || 'An unexpected error occurred');
    throw error;
  }
};

const showError = (message) => {
  Alert.alert('Error', message);
};
