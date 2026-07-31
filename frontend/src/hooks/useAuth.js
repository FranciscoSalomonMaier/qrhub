import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAuthenticatedUser, login as loginRequest, logout as logoutRequest } from "../services/auth";

const key = ["authenticated-user"];

export function useAuth() {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: key,
        queryFn: fetchAuthenticatedUser,
        retry: (count, error) => error?.response?.status !== 401 && count < 1,
        staleTime: 60_000,
    });
    const login = useMutation({
        mutationFn: loginRequest,
        onSuccess: (user) => queryClient.setQueryData(key, user),
    });
    const logout = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => queryClient.setQueryData(key, null),
    });

    return {
        user: query.data ?? null,
        isAuthenticated: Boolean(query.data),
        isLoading: query.isLoading,
        error: query.error,
        login: login.mutateAsync,
        isLoggingIn: login.isPending,
        logout: logout.mutateAsync,
        isLoggingOut: logout.isPending,
    };
}
