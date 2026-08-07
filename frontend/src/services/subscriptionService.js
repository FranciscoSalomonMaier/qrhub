import { api } from './api';

export async function listPlans() { return (await api.get('/plans')).data.data; }
export async function getCurrentSubscription() { return (await api.get('/subscription')).data; }
export async function startSubscriptionCheckout(planSlug) { return (await api.post('/subscriptions/checkout', { plan_slug: planSlug })).data; }
export async function confirmSubscription(payload) { return (await api.post('/subscriptions/confirm', payload)).data; }
