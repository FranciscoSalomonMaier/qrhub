import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { blankContent, defaultQrCode, qrCodeResolver } from '../../schemas/qrCodeSchema';
import { QrCodeContentForm } from '../qr-code-generator/QrCodeContentForm';
import { QrCodeCustomizationForm } from '../qr-code-generator/QrCodeCustomizationForm';
import { QrCodeLivePreview } from '../qr-code-generator/QrCodeLivePreview';
import { QrCodeTypeSelector } from '../qr-code-generator/QrCodeTypeSelector';

function hasPreviewContent(values) {
  const content = values.content ?? {};
  if (values.type === 'url') return /^https?:\/\//i.test(content.url ?? '');
  if (values.type === 'text') return Boolean(content.text?.trim());
  if (values.type === 'email') return Boolean(content.email?.includes('@'));
  if (values.type === 'phone' || values.type === 'whatsapp') return (content.phone?.replace(/\D/g, '').length ?? 0) >= 7;
  return Boolean(content.ssid?.trim()) && (content.encryption === 'nopass' || Boolean(content.password));
}

export function QrCodeForm({ initialValue, onSubmit, busy, serverError }) {
  const [saved, setSaved] = useState(null);
  const { register, handleSubmit, control, reset, setValue, getValues, formState: { errors } } = useForm({ resolver: qrCodeResolver, defaultValues: initialValue ?? defaultQrCode });
  useEffect(() => { if (initialValue) reset({ ...defaultQrCode, ...initialValue }); }, [initialValue, reset]);
  const values = useWatch({ control }) ?? defaultQrCode;

  function changeType(type) { if (type === values.type) return; setValue('type', type); setValue('content', structuredClone(blankContent[type]), { shouldValidate: true }); setSaved(null); }
  function resetCustomization() { for (const key of ['foreground_color', 'background_color', 'size', 'margin', 'error_correction_level']) setValue(key, defaultQrCode[key], { shouldValidate: true }); }
  function startAgain() { reset(defaultQrCode); setSaved(null); }
  async function submit(payload) { const result = await onSubmit(payload); if (result?.id) setSaved(result); }

  const previewPayload = { type: values.type, content: values.content, foreground_color: values.foreground_color, background_color: values.background_color, size: Number(values.size), margin: Number(values.margin), error_correction_level: values.error_correction_level };
  return <form onSubmit={handleSubmit(submit)} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]"><div className="min-w-0 space-y-7"><QrCodeTypeSelector value={values.type} onChange={changeType} /><QrCodeContentForm type={values.type} register={register} errors={errors} encryption={values.content?.encryption} textValue={values.content?.text} /><QrCodeCustomizationForm register={register} errors={errors} setValue={setValue} values={values} onReset={resetCustomization} />{serverError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{serverError}</p>}<label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input className="size-4 accent-blue-600" type="checkbox" {...register('is_active')} /> QR Code ativo</label></div><QrCodeLivePreview payload={{ ...previewPayload, name: values.name }} canPreview={hasPreviewContent(getValues())} saved={saved} onCreate={handleSubmit(submit)} creating={busy} onReset={startAgain} /></form>;
}
