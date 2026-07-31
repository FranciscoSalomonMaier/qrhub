import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-50 px-4 py-10">
            <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-100/80 to-transparent" />
            <section className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200" aria-hidden="true">Q</div>
                    <p className="mb-2 text-sm font-semibold tracking-wide text-blue-700">QRHUB</p>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950">Bem-vindo de volta</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Entre para acessar seu espaço de trabalho.</p>
                </div>
                <LoginForm />
            </section>
        </main>
    );
}
