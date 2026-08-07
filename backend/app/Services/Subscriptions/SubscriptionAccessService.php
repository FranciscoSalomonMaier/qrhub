<?php

namespace App\Services\Subscriptions;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Models\User;

class SubscriptionAccessService
{
    public function activeSubscription(User $user): ?Subscription
    {
        return $user->subscriptions()
            ->with('plan')
            ->where('status', SubscriptionStatus::Active->value)
            ->where('starts_at', '<=', now())
            ->where(fn ($query) => $query->whereNull('ends_at')->orWhere('ends_at', '>', now()))
            ->latest('starts_at')
            ->first();
    }

    public function hasActiveSubscription(User $user): bool
    {
        return $this->activeSubscription($user) !== null;
    }
}
