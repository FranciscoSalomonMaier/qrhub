<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = ['uuid', 'user_id', 'plan_id', 'status', 'starts_at', 'ends_at', 'cancelled_at', 'provider', 'provider_subscription_id'];

    protected function casts(): array
    {
        return ['status' => SubscriptionStatus::class, 'starts_at' => 'datetime', 'ends_at' => 'datetime', 'cancelled_at' => 'datetime'];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function plan(): BelongsTo { return $this->belongsTo(Plan::class); }
}
