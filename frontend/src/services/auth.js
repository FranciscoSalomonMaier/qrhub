import axios from "axios";
import { api, backendApi } from "./api";

export async function fetchAuthenticatedUser() {
    try {
        const response = await api.get("/auth/user");

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
        }

        throw error;
    }
}

export async function login(credentials) {
    await backendApi.get("/sanctum/csrf-cookie");
    return (await api.post("/auth/login", credentials)).data;
}

export async function logout() {
    return (await api.post("/auth/logout")).data;
}

export function getGoogleLoginUrl() {
    const base = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";
    return `${base.replace(/\/$/, "")}/api/v1/auth/google/redirect`;
}
