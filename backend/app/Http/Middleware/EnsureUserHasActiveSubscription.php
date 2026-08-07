<?php

namespace App\Http\Middleware;

use App\Services\Subscriptions\SubscriptionAccessService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasActiveSubscription
{
    public function __construct(private readonly SubscriptionAccessService $access) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $this->access->hasActiveSubscription($request->user())) {
            return new JsonResponse([
                'message' => 'Uma assinatura ativa é necessária para acessar este recurso.',
                'code' => 'ACTIVE_SUBSCRIPTION_REQUIRED',
            ], 403);
        }

        return $next($request);
    }
}
