import { api } from './api';

export async function listQrCodes(params) { return (await api.get('/qr-codes', { params })).data; }
export async function getQrCode(uuid) { return (await api.get(`/qr-codes/${uuid}`)).data.data; }
export async function createQrCode(payload) { return (await api.post('/qr-codes', payload)).data.data; }
export async function updateQrCode(uuid, payload) { return (await api.patch(`/qr-codes/${uuid}`, payload)).data.data; }
export async function deleteQrCode(uuid) { await api.delete(`/qr-codes/${uuid}`); }
export async function updateQrCodeStatus(uuid, isActive) { return (await api.patch(`/qr-codes/${uuid}/status`, { is_active: isActive })).data.data; }
export async function getQrCodePreview(uuid) { return (await api.get(`/qr-codes/${uuid}/preview`, { responseType: 'text' })).data; }
export async function previewQrCode(payload, signal) { return (await api.post('/qr-codes/preview', payload, { responseType: 'text', signal })).data; }
export function qrCodeUuid(qrCode) { return qrCode?.uuid ?? qrCode?.id; }

async function blobErrorMessage(error) {
  const blob = error.response?.data;
  if (!(blob instanceof Blob) || !blob.type?.includes('json')) return null;
  try { return JSON.parse(await blob.text()).message ?? null; } catch { return null; }
}

export async function downloadQrCode(uuid, format) {
  try {
    const response = await api.get(`/qr-codes/${uuid}/download/${format}`, { responseType: 'blob' });
    const disposition = response.headers['content-disposition'] ?? '';
    const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    const filename = (encoded ? decodeURIComponent(encoded) : disposition.match(/filename="?([^";]+)"?/i)?.[1]) ?? `qr-code.${format}`;
    const url = URL.createObjectURL(response.data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return filename;
  } catch (error) {
    const message = await blobErrorMessage(error);
    if (message) error.userMessage = message;
    throw error;
  }
}
