<?php

namespace Tests\Feature\Auth;

use App\Actions\Auth\ResolveGoogleUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_user_from_google(): void
    {
        $user = app(ResolveGoogleUser::class)->handle($this->googleUser(
            'google-123', 'new@example.com', 'New User', 'https://example.com/avatar.jpg'
        ));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'google_id' => 'google-123',
            'email' => 'new@example.com',
        ]);
        $this->assertNotNull($user->email_verified_at);
        $this->assertNotSame('', $user->password);
    }

    public function test_it_links_google_to_an_existing_email_account(): void
    {
        $existing = User::factory()->create(['email' => 'existing@example.com']);

        $resolved = app(ResolveGoogleUser::class)->handle($this->googleUser(
            'google-456', 'existing@example.com', 'Updated Name', null
        ));

        $this->assertTrue($existing->is($resolved));
        $this->assertSame('google-456', $resolved->google_id);
        $this->assertSame(1, User::count());
    }

    private function googleUser(string $id, string $email, string $name, ?string $avatar): SocialiteUser
    {
        $user = Mockery::mock(SocialiteUser::class);
        $user->shouldReceive('getId')->andReturn($id);
        $user->shouldReceive('getEmail')->andReturn($email);
        $user->shouldReceive('getName')->andReturn($name);
        $user->shouldReceive('getNickname')->andReturn(null);
        $user->shouldReceive('getAvatar')->andReturn($avatar);

        return $user;
    }
}
