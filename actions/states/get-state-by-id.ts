'use server'
import { api } from "@/utils/axios"

export const getStateById = async (stateId: number) => {
    try {
        const response = await api.get(`/estado/${stateId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};