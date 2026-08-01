import { useQrCodePreview } from '../../hooks/useQrCodes';

export function QrCodePreview({ uuid, name = 'QR Code' }) {
  const { data, isLoading, isError } = useQrCodePreview(uuid);
  const source = data ? `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(data)}` : null;
  return <div className="grid aspect-square place-items-center rounded-2xl border border-slate-200 bg-white p-4">{isLoading ? <span className="text-sm text-slate-400">Gerando prévia...</span> : isError ? <span className="text-sm text-red-600">Prévia indisponível.</span> : source ? <img className="h-full w-full object-contain" src={source} alt={`Prévia de ${name}`} /> : <span className="text-sm text-slate-400">Salve para gerar a prévia oficial.</span>}</div>;
}
