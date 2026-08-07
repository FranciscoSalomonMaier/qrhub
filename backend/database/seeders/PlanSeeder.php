<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['name' => 'Mensal', 'slug' => 'monthly', 'billing_interval' => 'month', 'billing_interval_count' => 1, 'price' => 29.90],
            ['name' => 'Semestral', 'slug' => 'semiannual', 'billing_interval' => 'month', 'billing_interval_count' => 6, 'price' => 149.40],
            ['name' => 'Anual', 'slug' => 'annual', 'billing_interval' => 'year', 'billing_interval_count' => 1, 'price' => 238.80],
        ] as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan + ['currency' => 'BRL', 'is_active' => true]);
        }
    }
}
