import { QrCodeIcon } from '@heroicons/react/24/outline';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navClass = ({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`;
export function QrCodeLayout() {
  const auth = useAuth();
  return <div className="min-h-screen bg-slate-50"><header className="sticky top-0 z-40 border-b bg-white/95"><div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6"><Link to="/" className="flex items-center gap-2 font-black"><span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white"><QrCodeIcon className="size-5" /></span><span className="text-xl">QR<span className="text-blue-600">Hub</span></span></Link><nav className="flex items-center gap-1"><NavLink end to="/" className={navClass}>Criar QR Code</NavLink><NavLink to="/plans" className={navClass}>Planos</NavLink>{auth.hasActiveSubscription && <NavLink to="/qr-codes" className={navClass}>Meus QR Codes</NavLink>}</nav><div className="flex items-center gap-3">{auth.isAuthenticated ? <><span className="max-w-28 truncate text-sm font-semibold">{auth.user?.name}</span><button disabled={auth.isLoggingOut} onClick={() => auth.logout()} className="text-sm font-semibold text-red-600">Sair</button></> : <Link className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white" to="/login">Entrar</Link>}</div></div></header><main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10"><Outlet /></main></div>;
}
