import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true,
    withXSRFToken: true,

});

export const backendApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000",
    headers: { Accept: "application/json" },
    withCredentials: true,
    withXSRFToken: true,
});
