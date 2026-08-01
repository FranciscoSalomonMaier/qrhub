<?php

namespace App\Http\Requests\QrCodes;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQrCodeStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['is_active' => ['required', 'boolean']];
    }
}
