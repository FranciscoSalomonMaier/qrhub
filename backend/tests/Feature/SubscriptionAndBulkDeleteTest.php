<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\QrCode;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class SubscriptionAndBulkDeleteTest extends TestCase
{
    use RefreshDatabase;

    private function plainUser(): User { return User::create(['name' => 'Teste', 'email' => Str::uuid().'@example.com', 'password' => Hash::make('password')]); }
    private function subscribe(User $user, string $status = 'active', $endsAt = null): void
    {
        $this->seed(PlanSeeder::class);
        $user->subscriptions()->create(['uuid' => (string) Str::uuid(), 'plan_id' => Plan::first()->id, 'status' => $status, 'starts_at' => now()->subDay(), 'ends_at' => $endsAt ?? now()->addMonth()]);
    }

    public function test_active_plans_are_publicly_listed(): void
    {
        $this->seed(PlanSeeder::class); Plan::where('slug', 'annual')->update(['is_active' => false]);
        $this->getJson('/api/v1/plans')->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_missing_expired_and_cancelled_subscriptions_are_rejected(): void
    {
        $missing = $this->plainUser();
        $this->actingAs($missing)->getJson('/api/v1/qr-codes')->assertForbidden()->assertJsonPath('code', 'ACTIVE_SUBSCRIPTION_REQUIRED');
        foreach ([['active', now()->subDay()], ['cancelled', now()->addMonth()]] as [$status, $end]) {
            $user = $this->plainUser(); $this->subscribe($user, $status, $end);
            $this->actingAs($user)->postJson('/api/v1/qr-codes', [])->assertForbidden();
        }
    }

    public function test_bulk_delete_is_atomic_scoped_and_soft_deletes(): void
    {
        $user = $this->plainUser(); $other = $this->plainUser(); $this->subscribe($user);
        $owned = QrCode::factory()->count(2)->for($user)->create(); $foreign = QrCode::factory()->for($other)->create();
        $this->actingAs($user)->postJson('/api/v1/qr-codes/bulk-delete', ['ids' => [$owned[0]->uuid, $foreign->uuid]])->assertUnprocessable();
        $this->assertNotSoftDeleted($owned[0]);
        $this->actingAs($user)->postJson('/api/v1/qr-codes/bulk-delete', ['ids' => $owned->pluck('uuid')->all()])->assertOk()->assertJsonPath('deleted_count', 2);
        foreach ($owned as $qrCode) $this->assertSoftDeleted($qrCode);
    }

    public function test_bulk_delete_validation_and_guards(): void
    {
        $user = $this->plainUser(); $this->subscribe($user);
        $uuid = (string) Str::uuid();
        foreach ([[], ['bad'], [$uuid, $uuid], array_fill(0, 101, $uuid)] as $ids) $this->actingAs($user)->postJson('/api/v1/qr-codes/bulk-delete', ['ids' => $ids])->assertUnprocessable();
        $this->app['auth']->forgetGuards();
        $this->postJson('/api/v1/qr-codes/bulk-delete', ['ids' => [$uuid]])->assertUnauthorized();
    }
}
