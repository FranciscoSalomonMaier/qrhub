<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = ['name', 'slug', 'billing_interval', 'billing_interval_count', 'price', 'currency', 'is_active'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2', 'billing_interval_count' => 'integer', 'is_active' => 'boolean'];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
