
import api from "./callAPI";

export const callApiCreateAccount = async (userData) => {
  console.log("Data user: ", userData)
 
  try{
    const data  = await api.post("/api/v1/auth/register", userData);
    console.log('data: ', data);
    return data.data;
  } catch (error) {
    console.log(error);
    return error.response.data
  }
};

export const callApiVerifyOTP = async (dataInput) => {
  try {
    console.log('dataInput: ', dataInput);
    const response = await api.post("/api/v1/auth/verify-otp", null ,{
      params: {
        username: dataInput?.username,
        otp: dataInput?.otp
      }
    });
    return response.data; 
  }
  catch (error) {
    console.log('Response data:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
};



export const callApiLogin = async (dataInput) => {
  console.log('dataInput: ', dataInput);
  try {
    const response = await api.post("/api/v1/auth/login", {
      username: dataInput?.username,
      password: dataInput?.password
    });
    console.log('response: ', response.data);
    return response.data; 
  } catch (error) {
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
      return error.response.data;
  }
};

export const callApiForgotPassword = async (dataInput) => {
  console.log('dataInput: ', dataInput);
  try {
    const response = await api.post("/api/v1/auth/forgot-password", {
      username: dataInput?.username,
      email: dataInput?.email
    });
    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response data:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
}

export const callApiResendOTP = async (dataInput) => {  
  console.log('dataInput: ', dataInput);
  try {
    const response = await api.post("/api/v1/auth/resend-otp", {
      username: dataInput?.username,
      email: dataInput?.email
    });
    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response data:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
}

export const callApiGetUserByUsername = async (dataInput) => {
  console.log('dataInput: ', dataInput);
  try {
    const response = await api.get(`/api/v1/user/by-username/${dataInput?.username}`);
    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response data:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
}