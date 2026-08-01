<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_codes', function (Blueprint $table): void {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 120);
            $table->string('type', 20)->index();
            $table->json('content');
            $table->string('slug')->unique();
            $table->string('foreground_color', 7)->default('#000000');
            $table->string('background_color', 7)->default('#FFFFFF');
            $table->unsignedSmallInteger('size')->default(512);
            $table->char('error_correction_level', 1)->default('M');
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_dynamic')->default(false);
            $table->string('logo_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
    }
};
