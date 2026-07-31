import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
    const { user, logout, isLoggingOut } = useAuth();
    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            if (import.meta.env.DEV) console.error("Falha no logout", error);
            window.location.assign("/login");
        }
    }
    return (
        <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
            <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
                {user.avatar ? <img className="mx-auto mb-5 size-20 rounded-full object-cover ring-4 ring-blue-100" src={user.avatar} alt={`Avatar de ${user.name}`} /> : <div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">{user.name?.charAt(0)}</div>}
                <p className="text-sm font-semibold text-blue-700">Você está logado.</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-950">Olá, {user.name}.</h1>
                <p className="mt-2 text-slate-500">Você está logado no QRHub.</p>
                <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                <Button className="mt-8 bg-slate-900 text-white hover:bg-slate-800" disabled={isLoggingOut} onClick={handleLogout}>{isLoggingOut ? "Saindo..." : "Sair"}</Button>
            </section>
        </main>
    );
}
