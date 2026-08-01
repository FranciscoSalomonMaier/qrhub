<?php

namespace App\Models;

use App\Enums\QrCodeErrorCorrectionLevel;
use App\Enums\QrCodeType;
use Database\Factories\QrCodeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class QrCode extends Model
{
    /** @use HasFactory<QrCodeFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['uuid', 'name', 'type', 'content', 'slug', 'foreground_color', 'background_color', 'size', 'error_correction_level', 'is_active', 'is_dynamic'];

    protected function casts(): array
    {
        return [
            'type' => QrCodeType::class,
            'content' => 'array',
            'error_correction_level' => QrCodeErrorCorrectionLevel::class,
            'is_active' => 'boolean',
            'is_dynamic' => 'boolean',
            'size' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
