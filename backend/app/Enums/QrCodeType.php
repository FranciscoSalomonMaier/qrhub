<?php

namespace App\Enums;

enum QrCodeType: string
{
    case Url = 'url';
    case Text = 'text';
    case Email = 'email';
    case Phone = 'phone';
    case Whatsapp = 'whatsapp';
    case Wifi = 'wifi';
}
