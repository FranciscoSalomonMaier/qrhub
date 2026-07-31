import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PageLoader } from "../ui/PageLoader";

export function PublicOnlyRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <PageLoader label="Carregando..." />;
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
