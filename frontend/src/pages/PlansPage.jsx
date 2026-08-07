import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCreateSubscription, usePlans } from '../hooks/useSubscription';

const money = (value, currency) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
export function PlansPage() {
  const plans = usePlans(); const auth = useAuth(); const actions = useCreateSubscription(); const navigate = useNavigate(); const location = useLocation();
  const [selected, setSelected] = useState(''); const [error, setError] = useState('');
  async function choose() {
    if (!auth.isAuthenticated) { navigate('/login?return=/plans'); return; }
    setError('');
    try { const checkout = await actions.checkout.mutateAsync(selected); await actions.confirm.mutateAsync({ subscription_uuid: checkout.subscription_uuid }); navigate('/?resume=create', { replace: true }); }
    catch (e) { setError(e.response?.data?.message ?? 'Não foi possível confirmar a assinatura.'); }
  }
  return <div><h1 className="text-3xl font-black">Escolha seu plano</h1><p className="mt-2 text-slate-600">Salve, edite e baixe seus QR Codes.</p>{location.state?.message && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-800">{location.state.message}</p>}<div className="mt-7 grid gap-5 md:grid-cols-3">{plans.data?.map((plan) => <button type="button" key={plan.slug} onClick={() => setSelected(plan.slug)} className={`rounded-2xl border bg-white p-6 text-left ${selected === plan.slug ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'}`}><h2 className="text-xl font-bold">{plan.name}</h2><p className="mt-3 text-2xl font-black">{money(plan.price, plan.currency)}</p><p className="text-sm text-slate-500">a cada {plan.billing_interval_count === 1 ? (plan.billing_interval === 'year' ? 'ano' : 'mês') : `${plan.billing_interval_count} meses`}</p><ul className="mt-5 space-y-2 text-sm text-slate-600"><li>Criação e gerenciamento</li><li>Downloads PNG e SVG</li><li>Personalização completa</li></ul></button>)}</div>{plans.isLoading && <p className="mt-8">Carregando planos...</p>}{error && <p className="mt-4 text-red-600">{error}</p>}<button disabled={!selected || actions.checkout.isPending || actions.confirm.isPending} onClick={choose} className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white disabled:opacity-50">{actions.checkout.isPending || actions.confirm.isPending ? 'Confirmando...' : auth.isAuthenticated ? 'Selecionar plano' : 'Entrar para continuar'}</button><p className="mt-3 text-xs text-amber-700">Ambiente de desenvolvimento: confirmação simulada, sem cobrança real.</p></div>;
}
