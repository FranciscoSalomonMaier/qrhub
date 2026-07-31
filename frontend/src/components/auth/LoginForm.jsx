import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getGoogleLoginUrl } from "../../services/auth";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

function friendlyError(error) {
    if (!error?.response) return "Não foi possível conectar ao servidor. Tente novamente em instantes.";
    if (error.response.status === 419) return "Sua sessão expirou. Atualize a página e tente novamente.";
    if (error.response.status === 422) return "Email ou senha inválidos.";
    if (error.response.status === 429) return "Muitas tentativas. Aguarde um minuto e tente novamente.";
    return "Não foi possível entrar. Tente novamente.";
}

export function LoginForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, isLoggingIn } = useAuth();
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [errors, setErrors] = useState({});
    const [requestError, setRequestError] = useState("");

    function validate() {
        const next = {};
        if (!form.email) next.email = "Informe seu email.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Informe um email válido.";
        if (!form.password) next.password = "Informe sua senha.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function submit(event) {
        event.preventDefault();
        setRequestError("");
        if (!validate()) return;
        try {
            await login(form);
            navigate("/", { replace: true });
        } catch (error) {
            if (import.meta.env.DEV) console.error("Falha no login", error);
            setRequestError(friendlyError(error));
        }
    }

    return (
        <form className="space-y-5" onSubmit={submit} noValidate>
            {(requestError || searchParams.get("google") === "error") && <Alert>{requestError || "Não foi possível entrar com o Google. Tente novamente."}</Alert>}
            <Input id="email" label="Email" type="email" autoComplete="email" placeholder="voce@empresa.com" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <div>
                <Input id="password" label="Senha" type="password" autoComplete="current-password" placeholder="Digite sua senha" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                <div className="mt-3 flex items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input className="size-4 accent-blue-600" type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} />
                        Lembrar de mim
                    </label>
                    <a className="text-sm font-medium text-blue-700 hover:underline" href="#recuperar">Esqueci minha senha</a>
                </div>
            </div>
            <Button className="bg-blue-600 text-white shadow-sm hover:bg-blue-700" type="submit" disabled={isLoggingIn}>
                {isLoggingIn && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                {isLoggingIn ? "Entrando..." : "Entrar"}
            </Button>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-slate-400"><span className="h-px flex-1 bg-slate-200" /><span>ou</span><span className="h-px flex-1 bg-slate-200" /></div>
            <Button className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" type="button" onClick={() => window.location.assign(getGoogleLoginUrl())}>
                <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 5.9Z"/></svg>
                Continuar com Google
            </Button>
        </form>
    );
}
