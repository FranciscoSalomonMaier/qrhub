import { useState } from 'react'; import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'; import { QrCodePreview } from '../../components/qr-codes/QrCodePreview'; import { QrCodeStatusBadge } from '../../components/qr-codes/QrCodeStatusBadge'; import { DeleteQrCodeModal } from '../../components/qr-codes/DeleteQrCodeModal'; import { useQrCode, useQrCodeMutations } from '../../hooks/useQrCodes'; import { downloadQrCode } from '../../services/qrCodeService';
export function QrCodeDetailPage() { 
    const { uuid } = useParams(); 
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const query = useQrCode(uuid); 
    const mutations = useQrCodeMutations(); 
    const [modal, setModal] = useState(false); 
    const [message, setMessage] = useState(location.state?.message ?? ''); 
    if (query.isLoading) return <p>Carregando...</p>; 
    if (query.isError){ 
        return <p className="text-red-600">QR Code não encontrado ou acesso não autorizado.</p>; 
    }
    const qr = query.data; 
    
    async function remove() { 
        await mutations.remove.mutateAsync(uuid); 
        navigate('/qr-codes'); 
    } 
    
    async function toggle() { 
        await mutations.status.mutateAsync({ uuid, isActive: !qr.is_active }); 
        setMessage('Status atualizado.'); 
    } 
    
    async function copy() { 
        await navigator.clipboard.writeText(JSON.stringify(qr.content)); 
        setMessage('Conteúdo copiado.'); 
    } 
    
    return (
        <>
            {
                message && 
                <p role="status" className="mb-5 rounded-xl bg-blue-50 p-3 text-blue-800">{message}</p>
            }
            <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
                <QrCodePreview uuid={uuid} name={qr.name} />
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase text-blue-600">{qr.type}</p>
                            <h1 className="mt-1 text-3xl font-black">{qr.name}</h1>
                        </div>
                        <QrCodeStatusBadge active={qr.is_active} />
                    </div>
                    <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-slate-500">Conteúdo</dt>
                            <dd className="mt-1 break-all font-medium">{JSON.stringify(qr.content)}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Tamanho</dt>
                            <dd>{qr.size}px · correção {qr.error_correction_level}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Cores</dt>
                            <dd className="flex gap-2">
                                <i className="size-5 rounded border" style={{ background: qr.foreground_color }} />{qr.foreground_color} / {qr.background_color}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Datas</dt>
                            <dd>Criado {new Date(qr.created_at).toLocaleString('pt-BR')}
                                <br />Atualizado {new Date(qr.updated_at).toLocaleString('pt-BR')}
                            </dd>
                        </div>
                    </dl>
                    <div className="mt-8 grid gap-2 sm:grid-cols-2">
                        <Link className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white" to={`/qr-codes/${uuid}/edit`}>Editar</Link>
                        <button className="rounded-xl border px-4 py-3" onClick={toggle}>{qr.is_active ? 'Desativar' : 'Ativar'}</button>
                        <button className="rounded-xl border px-4 py-3" onClick={() => downloadQrCode(uuid, 'png')}>Baixar PNG</button>
                        <button className="rounded-xl border px-4 py-3" onClick={() => downloadQrCode(uuid, 'svg')}>Baixar SVG</button>
                        <button className="rounded-xl border px-4 py-3" onClick={copy}>Copiar conteúdo</button>
                        <button className="rounded-xl px-4 py-3 text-red-600 hover:bg-red-50" onClick={() => setModal(true)}>Excluir</button>
                    </div>
                </section>
            </div>
            <DeleteQrCodeModal open={modal} name={qr.name} busy={mutations.remove.isPending} onCancel={() => setModal(false)} onConfirm={remove} />
        </>
    );
}
