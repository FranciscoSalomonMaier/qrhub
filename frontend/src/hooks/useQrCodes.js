import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/qrCodeService';

export const qrCodeKeys = {
  all: ['qr-codes'], lists: () => ['qr-codes', 'list'], list: (filters) => ['qr-codes', 'list', filters],
  details: () => ['qr-codes', 'detail'], detail: (uuid) => ['qr-codes', 'detail', uuid], preview: (uuid) => ['qr-codes', 'preview', uuid],
};
export function useQrCodes(filters) { return useQuery({ queryKey: qrCodeKeys.list(filters), queryFn: () => service.listQrCodes(filters), placeholderData: (old) => old }); }
export function useQrCode(uuid) { return useQuery({ queryKey: qrCodeKeys.detail(uuid), queryFn: () => service.getQrCode(uuid), enabled: Boolean(uuid) }); }
export function useQrCodePreview(uuid) { return useQuery({ queryKey: qrCodeKeys.preview(uuid), queryFn: () => service.getQrCodePreview(uuid), enabled: Boolean(uuid), staleTime: 60_000 }); }
export function useQrCodeMutations() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: qrCodeKeys.all });
  return {
    create: useMutation({ mutationFn: service.createQrCode, onSuccess: refresh }),
    update: useMutation({ mutationFn: ({ uuid, payload }) => service.updateQrCode(uuid, payload), onSuccess: refresh }),
    remove: useMutation({ mutationFn: service.deleteQrCode, onSuccess: refresh }),
    status: useMutation({ mutationFn: ({ uuid, isActive }) => service.updateQrCodeStatus(uuid, isActive), onSuccess: refresh }),
  };
}
