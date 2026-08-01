<?php

namespace App\Enums;

enum QrCodeErrorCorrectionLevel: string
{
    case Low = 'L';
    case Medium = 'M';
    case Quartile = 'Q';
    case High = 'H';
}
