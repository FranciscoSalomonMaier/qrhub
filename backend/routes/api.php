<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticatedUserController;
use App\Http\Controllers\Api\V1\Auth\GoogleAuthController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/auth')->group(function (): void {
    Route::post('/login', LoginController::class)->middleware('throttle:login');
    Route::middleware(['web', 'throttle:login'])->group(function (): void {
        Route::get('/google/redirect', [GoogleAuthController::class, 'redirect']);
        Route::get('/google/callback', [GoogleAuthController::class, 'callback']);
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/user', AuthenticatedUserController::class);
        Route::post('/logout', LogoutController::class);
    });
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'application' => config('app.nome'),
        'timestamp' => now()->toISOString(),
    ]);
});
