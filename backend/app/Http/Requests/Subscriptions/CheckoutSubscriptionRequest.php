<?php

namespace App\Http\Requests\Subscriptions;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutSubscriptionRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return ['plan_slug' => ['required', 'string', Rule::exists('plans', 'slug')->where('is_active', true)]];
    }
}
