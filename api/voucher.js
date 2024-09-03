import api from "./callAPI";

export const callApiGetUserVouchers = async ({userId,voucherType}) => {
    try {
        const response = await api.get(`/api/v1/vouchers/users/${userId}?type=${voucherType}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const callApiGetVouchers = async (eventId) => {
    try {
        const response = await api.get(`/api/v1/vouchers/events/{eventId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const callApiUseVoucher = async ({}) => {
    
}