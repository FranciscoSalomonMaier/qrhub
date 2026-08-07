<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(['data' => Plan::query()->where('is_active', true)->orderBy('price')->get()]);
    }
}
