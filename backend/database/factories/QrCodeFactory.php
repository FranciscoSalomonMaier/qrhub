<?php

namespace Database\Factories;

use App\Enums\QrCodeErrorCorrectionLevel;
use App\Enums\QrCodeType;
use App\Models\QrCode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<QrCode> */
class QrCodeFactory extends Factory
{
    protected $model = QrCode::class;

    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'uuid' => (string) Str::uuid(),
            'user_id' => User::factory(),
            'name' => $name,
            'type' => QrCodeType::Url,
            'content' => ['url' => fake()->url()],
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'foreground_color' => '#000000',
            'background_color' => '#FFFFFF',
            'size' => 512,
            'error_correction_level' => QrCodeErrorCorrectionLevel::Medium,
            'is_active' => true,
            'is_dynamic' => false,
        ];
    }
}
