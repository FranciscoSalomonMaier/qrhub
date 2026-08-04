<?php

namespace App\Http\Requests\QrCodes;

use Illuminate\Validation\Validator;

class PreviewQrCodeRequest extends QrCodeRequest
{
    public function rules(): array
    {
        $rules = $this->commonRules();
        $rules['name'] = ['sometimes', 'string', 'max:120'];

        return $rules;
    }

    public function after(): array
    {
        return [fn (Validator $validator) => $this->validateContent($validator)];
    }
}
