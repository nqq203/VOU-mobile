import api from "./callAPI";

export const callApiSendItem = async (data) => {
    console.log("SendData: ",data)
    try {
        const response = await api.post(`/api/v1/gifts`,data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const callApiGetGiftLog = async (idUser) => {
    console.log("Get: ",idUser)
    try {
        const response = await api.get(`/api/v1/gifts/users/${idUser}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}