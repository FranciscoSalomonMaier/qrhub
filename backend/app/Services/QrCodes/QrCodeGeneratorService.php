<?php

namespace App\Services\QrCodes;

use App\Enums\QrCodeErrorCorrectionLevel as AppLevel;
use App\Models\QrCode as QrCodeModel;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\SvgWriter;

class QrCodeGeneratorService
{
    public function __construct(private readonly QrCodeContentService $content) {}

    public function generate(QrCodeModel $model, string $format): string
    {
        $qrCode = new QrCode(
            data: $this->content->for($model),
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: $this->level($model->error_correction_level),
            size: $model->size,
            margin: 10,
            foregroundColor: $this->color($model->foreground_color),
            backgroundColor: $this->color($model->background_color),
        );
        $writer = $format === 'png' ? new PngWriter : new SvgWriter;

        return $writer->write($qrCode)->getString();
    }

    private function level(AppLevel $level): ErrorCorrectionLevel
    {
        return match ($level) {
            AppLevel::Low => ErrorCorrectionLevel::Low,
            AppLevel::Medium => ErrorCorrectionLevel::Medium,
            AppLevel::Quartile => ErrorCorrectionLevel::Quartile,
            AppLevel::High => ErrorCorrectionLevel::High,
        };
    }

    private function color(string $hex): Color
    {
        return new Color(hexdec(substr($hex, 1, 2)), hexdec(substr($hex, 3, 2)), hexdec(substr($hex, 5, 2)));
    }
}
