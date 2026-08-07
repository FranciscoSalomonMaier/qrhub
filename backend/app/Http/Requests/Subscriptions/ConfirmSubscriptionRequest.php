<?php

namespace App\Http\Requests\Subscriptions;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmSubscriptionRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array { return ['subscription_uuid' => ['required', 'uuid']]; }
}
