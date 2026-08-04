import { z } from 'zod';

const phone = z.string().regex(/^\+?[0-9() .-]{7,25}$/, 'Informe um telefone válido.');
const contentSchemas = {
  url: z.object({ url: z.string().url('Informe uma URL válida.').refine((v) => /^https?:\/\//i.test(v), 'Use http ou https.') }),
  text: z.object({ text: z.string().min(1, 'Informe o texto.').max(2000, 'Máximo de 2000 caracteres.') }),
  email: z.object({ email: z.string().email('Informe um email válido.'), subject: z.string().max(200).optional(), body: z.string().max(2000).optional() }),
  phone: z.object({ phone }), whatsapp: z.object({ phone, message: z.string().max(1000).optional() }),
  wifi: z.object({ ssid: z.string().min(1, 'Informe o nome da rede.'), password: z.string().optional(), encryption: z.enum(['WPA', 'WEP', 'nopass']), hidden: z.boolean() }).refine((v) => v.encryption === 'nopass' || Boolean(v.password), { path: ['password'], message: 'Informe a senha da rede.' }),
};
const base = z.object({ name: z.string().min(1, 'Informe um nome.').max(120), type: z.enum(['url', 'text', 'email', 'phone', 'whatsapp', 'wifi']), foreground_color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Informe uma cor hexadecimal válida.'), background_color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Informe uma cor hexadecimal válida.'), size: z.coerce.number().int().min(128).max(2048), margin: z.coerce.number().int().min(0).max(20), error_correction_level: z.enum(['L', 'M', 'Q', 'H']), is_active: z.boolean() });
export function validateQrCode(values) { const result = base.safeParse(values); if (!result.success) return result; const content = contentSchemas[result.data.type].safeParse(values.content); if (!content.success) return { success: false, error: content.error }; return { success: true, data: { ...result.data, content: content.data } }; }
export async function qrCodeResolver(values) {
  const result = validateQrCode(values); if (result.success) return { values: result.data, errors: {} };
  const errors = {}; for (const issue of result.error.issues) { const path = issue.path.join('.'); let cursor = errors; issue.path.forEach((part, i) => { if (i === issue.path.length - 1) cursor[part] = { type: 'validation', message: issue.message }; else cursor = cursor[part] ??= {}; }); if (!path) errors.root = { message: issue.message }; }
  return { values: {}, errors };
}
export const blankContent = { url: { url: '' }, text: { text: '' }, email: { email: '', subject: '', body: '' }, phone: { phone: '' }, whatsapp: { phone: '', message: '' }, wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false } };
export const defaultQrCode = { name: '', type: 'url', content: blankContent.url, foreground_color: '#000000', background_color: '#FFFFFF', size: 512, margin: 4, error_correction_level: 'M', is_active: true };
