<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create(['password' => 'password']);

        $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
            'remember' => true,
        ])->assertOk()->assertJsonPath('email', $user->email);

        $this->assertAuthenticatedAs($user);
    }

    public function test_invalid_credentials_return_a_generic_validation_error(): void
    {
        User::factory()->create(['email' => 'user@example.com']);

        $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/v1/auth/login', [
            'email' => 'user@example.com',
            'password' => 'incorrect',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('email')
            ->assertJsonMissing(['password']);

        $this->assertGuest();
    }

    public function test_authenticated_user_can_be_retrieved(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->withHeader('Origin', 'http://localhost:5173')
            ->getJson('/api/v1/auth/user')
            ->assertOk()
            ->assertJsonPath('email', $user->email);
    }

    public function test_guest_cannot_access_protected_routes(): void
    {
        $this->getJson('/api/v1/auth/user')->assertUnauthorized();
        $this->postJson('/api/v1/auth/logout')->assertUnauthorized();
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->withHeader('Origin', 'http://localhost:5173')
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout realizado com sucesso.');

        $this->assertTrue(\Illuminate\Support\Facades\Auth::guard('web')->guest());
    }
}
