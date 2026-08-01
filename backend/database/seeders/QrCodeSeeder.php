<?php

namespace Database\Seeders;

use App\Models\QrCode;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class QrCodeSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->each(function (User $user): void {
            $items = [
                ['Site da empresa', 'url', ['url' => 'https://example.com']],
                ['Mensagem de boas-vindas', 'text', ['text' => 'Bem-vindo ao QRHub!']],
                ['WhatsApp comercial', 'whatsapp', ['phone' => '+5511999999999', 'message' => 'Olá, gostaria de mais informações.']],
                ['Wi-Fi do escritório', 'wifi', ['ssid' => 'QRHub', 'password' => 'qrhub-demo', 'encryption' => 'WPA', 'hidden' => false]],
            ];
            foreach ($items as [$name, $type, $content]) {
                QrCode::factory()->for($user)->create(['name' => $name, 'type' => $type, 'content' => $content, 'slug' => Str::slug($name).'-'.Str::lower(Str::random(6))]);
            }
        });
    }
}
