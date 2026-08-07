<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\SubscriptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Subscriptions\CheckoutSubscriptionRequest;
use App\Http\Requests\Subscriptions\ConfirmSubscriptionRequest;
use App\Models\Plan;
use App\Services\Subscriptions\SubscriptionAccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function show(SubscriptionAccessService $access): JsonResponse
    {
        $subscription = $access->activeSubscription(request()->user());
        return response()->json([
            'has_active_subscription' => (bool) $subscription,
            'subscription' => $subscription ? $this->serialize($subscription) : null,
        ]);
    }

    public function checkout(CheckoutSubscriptionRequest $request): JsonResponse
    {
        abort_unless(app()->environment(['local', 'testing']), 501, 'O provedor de pagamento ainda não foi configurado.');
        $plan = Plan::where('slug', $request->validated('plan_slug'))->where('is_active', true)->firstOrFail();
        $subscription = $request->user()->subscriptions()->create([
            'uuid' => (string) Str::uuid(), 'plan_id' => $plan->id,
            'status' => SubscriptionStatus::Pending, 'provider' => 'development_simulation',
        ]);
        return response()->json([
            'message' => 'Checkout simulado criado exclusivamente para desenvolvimento.',
            'simulation' => true, 'subscription_uuid' => $subscription->uuid,
        ], 201);
    }

    public function confirm(ConfirmSubscriptionRequest $request): JsonResponse
    {
        abort_unless(app()->environment(['local', 'testing']), 501, 'O provedor de pagamento ainda não foi configurado.');
        $subscription = DB::transaction(function () use ($request) {
            $subscription = $request->user()->subscriptions()->where('uuid', $request->validated('subscription_uuid'))->lockForUpdate()->firstOrFail();
            abort_unless($subscription->status === SubscriptionStatus::Pending && $subscription->provider === 'development_simulation', 422, 'Esta assinatura não pode ser confirmada.');
            $plan = $subscription->plan;
            $startsAt = now();
            $endsAt = $plan->billing_interval === 'year'
                ? $startsAt->copy()->addYears($plan->billing_interval_count)
                : $startsAt->copy()->addMonths($plan->billing_interval_count);
            $subscription->update(['status' => SubscriptionStatus::Active, 'starts_at' => $startsAt, 'ends_at' => $endsAt]);
            return $subscription->fresh('plan');
        });
        return response()->json(['message' => 'Assinatura simulada confirmada.', 'simulation' => true, 'subscription' => $this->serialize($subscription)]);
    }

    private function serialize($subscription): array
    {
        return [
            'uuid' => $subscription->uuid, 'status' => $subscription->status->value,
            'starts_at' => $subscription->starts_at?->toISOString(), 'ends_at' => $subscription->ends_at?->toISOString(),
            'plan' => ['name' => $subscription->plan->name, 'slug' => $subscription->plan->slug],
        ];
    }
}
