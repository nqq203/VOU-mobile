import api from "./callAPI";

export const callApiGetEvents = async () => {
    try {
        const response = await api.get(`/api/v1/vouchers/users/${userId}?type=${voucherType}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}