<?php

namespace App\Http\Requests\QrCodes;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteQrCodesRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return ['ids' => ['required', 'array', 'min:1', 'max:100'], 'ids.*' => ['required', 'uuid', 'distinct:strict']];
    }
}
