import api from "./callAPI";

export const callAPIGetEvents = async () => {
  try {
    const response = await api.get("/api/v1/events");
    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response callAPIGetEvents:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
}

export const callAPIGetPost = async (id) => {
  try {
    const response = await api.get(`/api/v1/events/${id}`);
    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response callAPIGetPost:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
}

export const callAPIFav = async (idEvent, idUser) => {
  try {
    const response = await api.post(`/api/v1/favourite-events/${idEvent}/users/${idUser}`);
    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response callAPIFav:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
}