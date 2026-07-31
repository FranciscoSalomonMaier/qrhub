import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PageLoader } from "../ui/PageLoader";

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <PageLoader label="Verificando sua sessão..." />;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
