import { useState } from 'react';
import { QrCodeForm } from '../components/qr-codes/QrCodeForm';
import { useQrCodeMutations } from '../hooks/useQrCodes';

export function HomePage() {
  const { create } = useQrCodeMutations(); const [error, setError] = useState('');
  async function submit(payload) { setError(''); try { return await create.mutateAsync(payload); } catch (exception) { setError(exception.response?.data?.message ?? 'Não foi possível criar o QR Code. Revise os dados e tente novamente.'); throw exception; } }
  return <div><div className="mb-8"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Gerador de QR Code</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Crie. Personalize. Compartilhe.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">Transforme seus dados em um QR Code profissional, pronto para baixar e usar.</p></div><QrCodeForm onSubmit={submit} busy={create.isPending} serverError={error} /></div>;
}
