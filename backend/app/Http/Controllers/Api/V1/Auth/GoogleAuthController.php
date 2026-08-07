<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Actions\Auth\ResolveGoogleUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        request()->session()->put('google_login_intent', request()->query('intent') === 'create' ? 'create' : null);
        return Socialite::driver('google')->redirect();
    }

    public function callback(ResolveGoogleUser $resolveGoogleUser): RedirectResponse
    {
        try {
            $user = $resolveGoogleUser->handle(Socialite::driver('google')->user());
            Auth::login($user, true);
            request()->session()->regenerate();

            $path = request()->session()->pull('google_login_intent') === 'create' ? '/?resume=create' : '/';
            return redirect()->away(rtrim(config('app.frontend_url'), '/').$path);
        } catch (Throwable $exception) {
            Log::warning('Falha no login com Google.', ['exception' => $exception]);

            return redirect()->away(rtrim(config('app.frontend_url'), '/').'/login?google=error');
        }
    }
}
