import { ChatBubbleLeftRightIcon, DocumentTextIcon, EnvelopeIcon, LinkIcon, PhoneIcon, SignalIcon } from '@heroicons/react/24/outline';

export const qrTypes = [
  { value: 'url', label: 'URL', description: 'Direcione para um site ou página', icon: LinkIcon },
  { value: 'text', label: 'Texto', description: 'Compartilhe uma mensagem ou informação', icon: DocumentTextIcon },
  { value: 'email', label: 'Email', description: 'Abra uma nova mensagem de email', icon: EnvelopeIcon },
  { value: 'phone', label: 'Telefone', description: 'Facilite uma ligação com um toque', icon: PhoneIcon },
  { value: 'whatsapp', label: 'WhatsApp', description: 'Inicie uma conversa com mensagem pronta', icon: ChatBubbleLeftRightIcon },
  { value: 'wifi', label: 'Wi-Fi', description: 'Conecte à rede sem digitar a senha', icon: SignalIcon },
];
