<?php

namespace App\Http\Requests\QrCodes;

use App\Enums\QrCodeErrorCorrectionLevel;
use App\Enums\QrCodeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class QrCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function commonRules(bool $partial = false): array
    {
        $presence = $partial ? 'sometimes' : 'required';

        return [
            'name' => [$presence, 'string', 'max:120'],
            'type' => [$presence, Rule::enum(QrCodeType::class)],
            'content' => [$presence, 'array'],
            'foreground_color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'background_color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'size' => ['sometimes', 'integer', 'min:128', 'max:2048'],
            'error_correction_level' => ['sometimes', Rule::enum(QrCodeErrorCorrectionLevel::class)],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    protected function validateContent(Validator $validator): void
    {
        $type = $this->input('type', $this->route('qrCode')?->type?->value);
        $content = $this->input('content');
        if (! is_array($content)) {
            return;
        }

        $rules = match ($type) {
            'url' => ['url' => ['required', 'url:http,https', 'max:2048']],
            'text' => ['text' => ['required', 'string', 'max:2000']],
            'email' => ['email' => ['required', 'email', 'max:254'], 'subject' => ['nullable', 'string', 'max:200'], 'body' => ['nullable', 'string', 'max:2000']],
            'phone' => ['phone' => ['required', 'string', 'regex:/^\+?[0-9() .-]{7,25}$/']],
            'whatsapp' => ['phone' => ['required', 'string', 'regex:/^\+?[0-9() .-]{7,25}$/'], 'message' => ['nullable', 'string', 'max:1000']],
            'wifi' => ['ssid' => ['required', 'string', 'max:100'], 'password' => [Rule::requiredIf(fn () => ($content['encryption'] ?? null) !== 'nopass'), 'nullable', 'string', 'max:255'], 'encryption' => ['required', Rule::in(['WPA', 'WEP', 'nopass'])], 'hidden' => ['required', 'boolean']],
            default => [],
        };

        $nested = validator($content, $rules, $this->messages());
        foreach ($nested->errors()->toArray() as $key => $messages) {
            foreach ($messages as $message) {
                $validator->errors()->add("content.$key", $message);
            }
        }
    }

    public function messages(): array
    {
        return [
            'required' => 'O campo :attribute é obrigatório.',
            'url' => 'Informe uma URL válida usando http ou https.',
            'regex' => 'O formato do campo :attribute é inválido.',
            'email' => 'Informe um email válido.',
            'max' => 'O campo :attribute excedeu o tamanho máximo.',
        ];
    }
}
