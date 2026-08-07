const KEY = 'qrhub:pending-qr-code';
const VERSION = 1;
export function saveQrCodeDraft(data) { sessionStorage.setItem(KEY, JSON.stringify({ version: VERSION, data })); }
export function loadQrCodeDraft() {
  try { const value = JSON.parse(sessionStorage.getItem(KEY)); return value?.version === VERSION && value.data && typeof value.data === 'object' ? value.data : null; }
  catch { return null; }
}
export function clearQrCodeDraft() { sessionStorage.removeItem(KEY); }
