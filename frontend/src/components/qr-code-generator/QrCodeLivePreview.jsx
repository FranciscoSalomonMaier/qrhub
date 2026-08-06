import { ArrowDownTrayIcon, CheckCircleIcon, EyeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDownloadQrCode, useQrCodeLivePreview } from '../../hooks/useQrCodes';
import { qrCodeUuid } from '../../services/qrCodeService';
import { qrTypes } from './qrCodeTypes';

function useDebounced(value, delay = 450) { const [debounced, setDebounced] = useState(value); useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]); return debounced; }

export function QrCodeLivePreview({ payload, displayName, canPreview, saved, onCreate, creating, onReset }) {
  const debounced = useDebounced(payload); const preview = useQrCodeLivePreview(debounced, canPreview); const download = useDownloadQrCode();
  const [downloadError, setDownloadError] = useState('');
  const source = preview.data ? `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(preview.data)}` : null;
  const typeLabel = qrTypes.find((item) => item.value === payload.type)?.label;
  async function handleDownload(format) { setDownloadError(''); try { await download.mutateAsync({ uuid: qrCodeUuid(saved), format }); } catch (error) { setDownloadError(error.userMessage ?? 'Não foi possível baixar o QR Code. Tente novamente.'); } }
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Prévia</p>
              <h2 className="mt-1 font-black text-slate-950">{displayName || 'Seu QR Code'}</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">SVG · alta qualidade</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Tipo: {typeLabel}</p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            {
              preview.isFetching && !source ?
              <div className="flex flex-col items-center gap-3 text-sm text-slate-500" role="status">
                <span className="size-7 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />Atualizando prévia...
              </div> : preview.isError ? 
              <div className="max-w-56 text-center text-sm text-red-600">
                Não foi possível gerar a prévia. Revise os dados informados.
              </div> : source ? 
              <img className="h-full w-full object-contain" src={source} alt={`Prévia de ${displayName || 'QR Code'}`} />
              : 
              <div className="max-w-56 text-center">
                <EyeIcon className="mx-auto size-10 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-600">Preencha os dados para visualizar o QR Code.</p>
              </div>
            }
            {preview.isFetching && source && <span className="absolute inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-600 shadow" role="status"><span className="size-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />Atualizando...</span>}
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            {saved ? 'QR Code salvo. Você já pode baixar o arquivo.' : 'A prévia será atualizada enquanto você personaliza.'}
          </p>
          {
            saved && 
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800" role="status"><CheckCircleIcon className="size-5" /> 
              QR Code criado com sucesso.
            </div>
          }
          
          <button type="button" disabled={creating} onClick={onCreate} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {
              creating ? 
              <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> 
              : 
              <PlusIcon className="size-5" />
            }
            
            {
              creating ? 
              'Criando...' 
              : 
              'Criar QR Code'
            }
          </button>
          
          {
            saved && 
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" disabled={download.isPending} onClick={() => handleDownload('png')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-bold hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
                {download.isPending && download.variables?.format === 'png' ? <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /> : <ArrowDownTrayIcon className="size-4" />} PNG
              </button>
              <button type="button" disabled={download.isPending} onClick={() => handleDownload('svg')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-bold hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
                {download.isPending && download.variables?.format === 'svg' ? <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /> : <ArrowDownTrayIcon className="size-4" />} SVG
              </button>
              <Link className="col-span-2 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white" to={`/qr-codes/${saved.id}`}>
                Ver detalhes
              </Link>
            </div>
          }
          {downloadError && <p className="mt-3 text-sm text-red-600" role="alert">{downloadError}</p>}
          
          <button type="button" onClick={onReset} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50">
            <TrashIcon className="size-4" /> Começar novamente
          </button>
        </div>
      </section>
    </aside>
  );
}
