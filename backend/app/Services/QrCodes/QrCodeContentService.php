<?php

namespace App\Services\QrCodes;

use App\Enums\QrCodeType;
use App\Models\QrCode;

class QrCodeContentService
{
    public function for(QrCode $qrCode): string
    {
        $content = $qrCode->content;

        return match ($qrCode->type) {
            QrCodeType::Url => $content['url'],
            QrCodeType::Text => $content['text'],
            QrCodeType::Email => $this->email($content),
            QrCodeType::Phone => 'tel:'.$this->phone($content['phone']),
            QrCodeType::Whatsapp => $this->whatsapp($content),
            QrCodeType::Wifi => $this->wifi($content),
        };
    }

    private function email(array $content): string
    {
        $query = http_build_query(array_filter(['subject' => $content['subject'] ?? null, 'body' => $content['body'] ?? null], fn ($value) => $value !== null && $value !== ''), '', '&', PHP_QUERY_RFC3986);

        return 'mailto:'.$content['email'].($query ? '?'.$query : '');
    }

    private function phone(string $phone): string
    {
        return preg_replace('/[^0-9+]/', '', $phone);
    }

    private function whatsapp(array $content): string
    {
        $url = 'https://wa.me/'.preg_replace('/\D/', '', $content['phone']);

        return $url.(empty($content['message']) ? '' : '?text='.rawurlencode($content['message']));
    }

    private function wifi(array $content): string
    {
        $escape = fn (string $value) => str_replace(['\\', ';', ',', ':'], ['\\\\', '\\;', '\\,', '\\:'], $value);

        return sprintf('WIFI:T:%s;S:%s;P:%s;H:%s;;', $content['encryption'], $escape($content['ssid']), $escape($content['password'] ?? ''), ($content['hidden'] ?? false) ? 'true' : 'false');
    }
}
