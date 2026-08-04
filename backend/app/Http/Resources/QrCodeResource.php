<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QrCodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'name' => $this->name,
            'type' => $this->type->value,
            'content' => $this->content,
            'slug' => $this->slug,
            'foreground_color' => $this->foreground_color,
            'background_color' => $this->background_color,
            'size' => $this->size,
            'margin' => $this->margin,
            'error_correction_level' => $this->error_correction_level->value,
            'is_active' => $this->is_active,
            'is_dynamic' => $this->is_dynamic,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
