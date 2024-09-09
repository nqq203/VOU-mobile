import api from "./callAPI";

export const callApiAddTurn = async (userId,gameId) => {
    console.log("Here: ",userId + "  _ " + gameId)
    try {
        const response = await api.post(`/api/v1/game/turns/${userId}/${gameId}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

export const callApiGiveTurn = async (turnData) => {
    console.log(turnData)
    try {
        const response = await api.post(`/api/v1/game/turns`,turnData);
        return response.data;
    } catch (error) {
        return error.response;
    }
}