import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Input } from '../ui/Input';
import { qrCodeResolver, defaultQrCode } from '../../schemas/qrCodeSchema';
import { QrCodePreview } from './QrCodePreview';

const typeLabels = { url: 'URL', text: 'Texto', email: 'Email', phone: 'Telefone', whatsapp: 'WhatsApp', wifi: 'Wi-Fi' };
const blankContent = { url: { url: '' }, text: { text: '' }, email: { email: '', subject: '', body: '' }, phone: { phone: '' }, whatsapp: { phone: '', message: '' }, wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false } };
function Field({ register, errors, name, label, ...props }) { const error = name.split('.').reduce((value, key) => value?.[key], errors); return <Input id={name} label={label} error={error?.message} {...register(name)} {...props} />; }
function ContentFields({ type, register, errors, encryption }) {
  if (type === 'url') return <Field name="content.url" label="URL de destino" placeholder="https://exemplo.com" register={register} errors={errors} />;
  if (type === 'text') return <label className="block text-sm font-medium text-slate-700">Texto<textarea className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 p-3" {...register('content.text')} />{errors.content?.text && <span className="text-sm text-red-600">{errors.content.text.message}</span>}</label>;
  if (type === 'email') return <><Field name="content.email" label="Email" type="email" register={register} errors={errors} /><Field name="content.subject" label="Assunto" register={register} errors={errors} /><Field name="content.body" label="Mensagem" register={register} errors={errors} /></>;
  if (type === 'phone') return <Field name="content.phone" label="Número de telefone" placeholder="+55 11 99999-9999" register={register} errors={errors} />;
  if (type === 'whatsapp') return <><Field name="content.phone" label="Número do WhatsApp" register={register} errors={errors} /><Field name="content.message" label="Mensagem inicial" register={register} errors={errors} /></>;
  return <><Field name="content.ssid" label="Nome da rede" register={register} errors={errors} /><label className="block text-sm font-medium text-slate-700">Segurança<select className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" {...register('content.encryption')}><option>WPA</option><option>WEP</option><option value="nopass">Aberta</option></select></label>{encryption !== 'nopass' && <Field name="content.password" label="Senha" type="password" register={register} errors={errors} />}<label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" {...register('content.hidden')} /> Rede oculta</label></>;
}
export function QrCodeForm({ initialValue, uuid, onSubmit, busy, serverError }) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({ resolver: qrCodeResolver, defaultValues: initialValue ?? defaultQrCode });
  useEffect(() => { if (initialValue) reset(initialValue); }, [initialValue, reset]);
  const type = useWatch({ control, name: 'type' }); const encryption = useWatch({ control, name: 'content.encryption' }); const name = useWatch({ control, name: 'name' });
  function changeType(event) { const next = event.target.value; setValue('type', next); setValue('content', blankContent[next], { shouldValidate: true }); }
  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
    <div className="space-y-6"><section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Informações gerais</h2><Field name="name" label="Nome" register={register} errors={errors} /><label className="block text-sm font-medium text-slate-700">Tipo<select className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" {...register('type')} onChange={changeType}>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></section>
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Conteúdo</h2><ContentFields type={type} register={register} errors={errors} encryption={encryption} /></section>
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Personalização</h2><div className="grid gap-4 sm:grid-cols-2"><Field name="foreground_color" label="Cor principal" type="color" register={register} errors={errors} /><Field name="background_color" label="Cor de fundo" type="color" register={register} errors={errors} /><Field name="size" label="Tamanho (px)" type="number" register={register} errors={errors} /><label className="block text-sm font-medium text-slate-700">Correção de erro<select className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" {...register('error_correction_level')}><option value="L">L — baixa</option><option value="M">M — média</option><option value="Q">Q — alta</option><option value="H">H — máxima</option></select></label></div><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" {...register('is_active')} /> QR Code ativo</label></section>
    {serverError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}<button disabled={busy} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{busy ? 'Salvando...' : 'Salvar QR Code'}</button></div>
    <aside className="lg:sticky lg:top-6 lg:self-start"><h2 className="mb-3 font-bold">Prévia oficial</h2><QrCodePreview uuid={uuid} name={name} /><p className="mt-2 text-xs text-slate-500">{uuid ? 'Atualizada após salvar as alterações.' : 'A prévia será gerada pelo servidor após salvar.'}</p></aside>
  </form>;
}
