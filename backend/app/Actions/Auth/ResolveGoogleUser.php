<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class ResolveGoogleUser
{
    public function handle(SocialiteUser $googleUser): User
    {
        return DB::transaction(function () use ($googleUser): User {
            $user = User::where('google_id', $googleUser->getId())->first()
                ?? User::where('email', $googleUser->getEmail())->first();

            if (! $user) {
                $user = new User([
                    'email' => $googleUser->getEmail(),
                    'password' => Str::password(40),
                ]);
            }

            $user->fill([
                'name' => $googleUser->getName() ?: $googleUser->getNickname() ?: $user->name,
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
            ]);

            if (! $user->email_verified_at) {
                $user->email_verified_at = now();
            }

            $user->save();

            return $user;
        });
    }
}
