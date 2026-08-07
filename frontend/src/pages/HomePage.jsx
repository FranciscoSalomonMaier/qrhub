import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QrCodeForm } from '../components/qr-codes/QrCodeForm';
import { useAuth } from '../hooks/useAuth';
import { useQrCodeMutations } from '../hooks/useQrCodes';
import { clearQrCodeDraft, loadQrCodeDraft, saveQrCodeDraft } from '../services/qrCodeDraft';

export function HomePage() {
  const { create } = useQrCodeMutations(); const auth = useAuth(); const navigate = useNavigate(); const [params] = useSearchParams();
  const [error, setError] = useState(''); const [draft] = useState(loadQrCodeDraft); const saving = useRef(false);
  useEffect(() => { if (params.get('resume') === 'create' && draft && auth.isAuthenticated && !auth.isLoading && !auth.hasActiveSubscription) navigate('/plans', { replace: true }); }, [params, draft, auth.isAuthenticated, auth.isLoading, auth.hasActiveSubscription, navigate]);
  async function submit(payload) {
    setError(''); saveQrCodeDraft(payload);
    if (!auth.isAuthenticated) { navigate('/login?return=/?resume=create'); return null; }
    if (!auth.hasActiveSubscription) { navigate('/plans', { state: { message: 'Escolha um plano para continuar.' } }); return null; }
    if (saving.current) return null; saving.current = true;
    try { const result = await create.mutateAsync(payload); clearQrCodeDraft(); navigate(`/qr-codes/${result.id}`); return result; }
    catch (exception) { setError(exception.response?.data?.message ?? 'Não foi possível criar o QR Code. Revise os dados e tente novamente.'); throw exception; }
    finally { saving.current = false; }
  }
  return <div><div className="mb-8"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Gerador de QR Code</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Crie. Personalize. Compartilhe.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">Monte e visualize gratuitamente. Entre e assine apenas quando quiser salvar.</p></div><QrCodeForm initialValue={draft} onSubmit={submit} busy={create.isPending} serverError={error} /></div>;
}
