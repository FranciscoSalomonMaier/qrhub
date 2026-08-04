import { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { QrCodeForm } from '../../components/qr-codes/QrCodeForm'; import { useQrCodeMutations } from '../../hooks/useQrCodes';
export function CreateQrCodePage() { 
    const navigate = useNavigate(); 
    const { create } = useQrCodeMutations(); 
    const [error, setError] = useState(''); 
    
    async function submit(payload) { 
        try { 
            const qr = await create.mutateAsync(payload); 
            navigate(`/qr-codes/${qr.id}`, { state: { message: 'QR Code criado com sucesso.' } }); 
        } catch (e) { 
            setError(e.response?.data?.message ?? 'Não foi possível criar o QR Code.'); 
        } 
    } 
    
    return (
        <>
            <h1 className="mb-6 text-3xl font-black">Criar QR Code</h1>
            <QrCodeForm onSubmit={submit} busy={create.isPending} serverError={error} />
        </>
    ); 
}
