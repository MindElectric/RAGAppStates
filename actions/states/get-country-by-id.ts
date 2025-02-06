'use server'
import { api } from "@/utils/axios"

export const getCountryById = async (stateId: string) => {
    try {
        const response = await api.get(`/paises/${stateId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};
