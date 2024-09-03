import api from "./callAPI";

export const callApiGetEvents = async () => {
    try {
        const response = await api.get(`/api/v1/events`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const callApiGetEventDetail = async (eventId) => {
    try {
        const response = await api.get(`/api/v1/events/${eventId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}