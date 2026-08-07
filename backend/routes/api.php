<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticatedUserController;
use App\Http\Controllers\Api\V1\Auth\GoogleAuthController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\QrCodeController;
use App\Http\Controllers\Api\V1\PlanController;
use App\Http\Controllers\Api\V1\SubscriptionController;
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

Route::prefix('v1')->group(function (): void {
    Route::get('/plans', PlanController::class)->middleware('throttle:60,1');
    Route::post('/qr-codes/preview', [QrCodeController::class, 'preview'])->middleware('throttle:30,1');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/subscription', [SubscriptionController::class, 'show']);
        Route::post('/subscriptions/checkout', [SubscriptionController::class, 'checkout'])->middleware('throttle:10,1');
        Route::post('/subscriptions/confirm', [SubscriptionController::class, 'confirm'])->middleware('throttle:10,1');
    });

    Route::middleware(['auth:sanctum', 'subscription.active'])->group(function (): void {
        Route::post('/qr-codes/bulk-delete', [QrCodeController::class, 'bulkDelete']);
    Route::get('/qr-codes/{qrCode}/preview', [QrCodeController::class, 'savedPreview']);
    Route::get('/qr-codes/{qrCode}/download/{format}', [QrCodeController::class, 'download'])->whereIn('format', ['png', 'svg']);
    Route::patch('/qr-codes/{qrCode}/status', [QrCodeController::class, 'status']);
    Route::apiResource('qr-codes', QrCodeController::class);
    });
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'application' => config('app.nome'),
        'timestamp' => now()->toISOString(),
    ]);
});
