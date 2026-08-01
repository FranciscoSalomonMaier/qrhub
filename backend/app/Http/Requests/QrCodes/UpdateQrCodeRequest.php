<?php

namespace App\Http\Requests\QrCodes;

use Illuminate\Validation\Validator;

class UpdateQrCodeRequest extends QrCodeRequest
{
    public function rules(): array
    {
        return $this->commonRules(true);
    }

    public function after(): array
    {
        return [fn (Validator $validator) => $this->validateContent($validator)];
    }
}
