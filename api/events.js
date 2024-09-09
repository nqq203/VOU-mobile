import api from "./callAPI";

export const callAPIGetEvents = async () => {
  try {
    const response = await api.get("/api/v1/events");
    // console.log('response: ', response.data);
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
    // console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response callAPIGetPost:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
}

export const callAPIFav = async (idEvent, idUser, username) => {
  try {
    console.log("Payload: ", idEvent, idUser, username);
    const response = await api.post(`/api/v1/favourite-events/${idEvent}/users/${idUser}/${username}`);
    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Response callAPIFav:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  }
};
export const callApiGetFavoriteVouchers = async (userId) => {
  try {
    console.log("Get: ",userId)
    const response = await api.get(`/api/v1/favourite-events?id_player=${userId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const callApiGetUserTurns = async (idPlayer, idGame) => {
  try{
    console.log("Payload: ", idPlayer, idGame);
    const response = await api.get(`/api/v1/game/${idGame}/players/${idPlayer}/turns`)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}