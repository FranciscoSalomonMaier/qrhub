<?php

namespace App\Http\Requests\QrCodes;

use Illuminate\Validation\Validator;

class StoreQrCodeRequest extends QrCodeRequest
{
    public function rules(): array
    {
        return $this->commonRules();
    }

    public function after(): array
    {
        return [fn (Validator $validator) => $this->validateContent($validator)];
    }
}
