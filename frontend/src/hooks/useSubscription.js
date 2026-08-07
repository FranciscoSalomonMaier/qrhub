import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/subscriptionService';

export const subscriptionKey = ['subscription'];
export function usePlans() { return useQuery({ queryKey: ['plans'], queryFn: service.listPlans, staleTime: 300_000 }); }
export function useSubscription(enabled = true) { return useQuery({ queryKey: subscriptionKey, queryFn: service.getCurrentSubscription, enabled, retry: false }); }
export function useCreateSubscription() {
  const client = useQueryClient();
  const checkout = useMutation({ mutationFn: service.startSubscriptionCheckout });
  const confirm = useMutation({ mutationFn: service.confirmSubscription, onSuccess: async () => {
    await Promise.all([client.invalidateQueries({ queryKey: subscriptionKey }), client.invalidateQueries({ queryKey: ['authenticated-user'] })]);
  }});
  return { checkout, confirm };
}
