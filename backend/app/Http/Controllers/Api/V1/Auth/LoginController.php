<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Actions\Auth\AuthenticateUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request, AuthenticateUser $authenticate): UserResource
    {
        $data = $request->validated();
        $user = $authenticate->handle(
            ['email' => $data['email'], 'password' => $data['password']],
            $data['remember'] ?? false,
        );

        return new UserResource($user);
    }
}
