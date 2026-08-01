<?php

namespace App\Policies;

use App\Models\QrCode;
use App\Models\User;

class QrCodePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function view(User $user, QrCode $qrCode): bool
    {
        return $user->is($qrCode->user);
    }

    public function update(User $user, QrCode $qrCode): bool
    {
        return $user->is($qrCode->user);
    }

    public function delete(User $user, QrCode $qrCode): bool
    {
        return $user->is($qrCode->user);
    }
}
