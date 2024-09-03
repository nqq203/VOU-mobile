import api from "./callAPI";

export const callApiShakeGame = async ({ idUser, idGame }) => {
  try {
    console.log('callApiShakeGame: ', idUser, idGame);
    const response = await api.post(`api/v1/game/${idGame}/player/${idUser}`);

    console.log('response: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Error during API call: ', error.response?.data);
    return error.response?.data
  }
};
