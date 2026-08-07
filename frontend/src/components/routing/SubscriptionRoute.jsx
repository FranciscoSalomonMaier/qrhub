import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageLoader } from '../ui/PageLoader';

export function SubscriptionRoute() {
  const auth = useAuth(); const location = useLocation();
  if (auth.isLoading) return <PageLoader label="Verificando sua assinatura..." />;
  if (!auth.isAuthenticated) return <Navigate to={`/login?return=${encodeURIComponent(location.pathname)}`} replace />;
  if (!auth.hasActiveSubscription) return <Navigate to="/plans" replace state={{ message: 'Uma assinatura ativa é necessária para acessar seus QR Codes.' }} />;
  return <Outlet />;
}
