import api from "./callAPI";

export const callApiGetUserVouchers = async ({userId,voucherType}) => {
    try {
        const response = await api.get(`/api/v1/vouchers/users/${userId}?type=${voucherType}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const callApiExchangeVoucher = async (code,userId) => {
    try {
        const response = await api.post(`/api/v1/vouchers/${code}/users/${userId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}