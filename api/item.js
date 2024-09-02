import api from "./callAPI";

export const callApiGetItems = async (userId) => {
    console.log("Here: ",userId)
    try {
        const response = await api.get(`/api/v1/item-repos/${userId}`);
        return response;
    } catch (error) {
        return error.response;
    }
}