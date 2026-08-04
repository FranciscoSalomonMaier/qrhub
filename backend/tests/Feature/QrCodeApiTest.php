<?php

namespace Tests\Feature;

use App\Models\QrCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QrCodeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_qr_code_routes(): void
    {
        $qrCode = QrCode::factory()->create();
        $this->getJson('/api/v1/qr-codes')->assertUnauthorized();
        $this->getJson("/api/v1/qr-codes/{$qrCode->uuid}")->assertUnauthorized();
    }

    public function test_list_only_contains_authenticated_users_qr_codes_and_supports_filters(): void
    {
        $user = User::factory()->create();
        QrCode::factory()->for($user)->create(['name' => 'Meu WhatsApp', 'type' => 'whatsapp', 'content' => ['phone' => '+5511999999999'], 'is_active' => true]);
        QrCode::factory()->for($user)->create(['name' => 'Inativo', 'is_active' => false]);
        QrCode::factory()->create(['name' => 'Outro usuário']);

        $this->actingAs($user)->getJson('/api/v1/qr-codes?search=WhatsApp&type=whatsapp&status=active&per_page=1')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Meu WhatsApp')->assertJsonPath('meta.per_page', 1);
        $this->actingAs($user)->getJson('/api/v1/qr-codes?sort=id')->assertUnprocessable();
    }

    public function test_user_can_create_all_supported_types(): void
    {
        $user = User::factory()->create();
        $contents = [
            'url' => ['url' => 'https://example.com'],
            'text' => ['text' => 'Conteúdo'],
            'email' => ['email' => 'contato@example.com', 'subject' => 'Olá'],
            'phone' => ['phone' => '+55 11 99999-9999'],
            'whatsapp' => ['phone' => '+55 11 99999-9999', 'message' => 'Olá'],
            'wifi' => ['ssid' => 'Rede', 'password' => 'segredo', 'encryption' => 'WPA', 'hidden' => false],
        ];

        foreach ($contents as $type => $content) {
            $this->actingAs($user)->postJson('/api/v1/qr-codes', ['name' => "QR $type", 'type' => $type, 'content' => $content])
                ->assertCreated()->assertJsonPath('data.type', $type)->assertJsonMissingPath('data.user_id');
        }
        $this->assertDatabaseCount('qr_codes', 6);
    }

    public function test_invalid_type_specific_content_is_rejected(): void
    {
        $this->actingAs(User::factory()->create())->postJson('/api/v1/qr-codes', ['name' => 'Inválido', 'type' => 'url', 'content' => ['url' => 'javascript:alert(1)']])
            ->assertUnprocessable()->assertJsonValidationErrors('content.url');
    }

    public function test_owner_can_view_update_toggle_and_soft_delete(): void
    {
        $user = User::factory()->create();
        $qrCode = QrCode::factory()->for($user)->create();
        $base = "/api/v1/qr-codes/{$qrCode->uuid}";

        $this->actingAs($user)->getJson($base)->assertOk()->assertJsonPath('data.id', $qrCode->uuid);
        $this->actingAs($user)->patchJson($base, ['name' => 'Atualizado'])->assertOk()->assertJsonPath('data.name', 'Atualizado');
        $this->actingAs($user)->patchJson("$base/status", ['is_active' => false])->assertOk()->assertJsonPath('data.is_active', false);
        $this->actingAs($user)->deleteJson($base)->assertNoContent();
        $this->assertSoftDeleted($qrCode);
    }

    public function test_other_user_cannot_access_mutate_delete_preview_or_download(): void
    {
        $qrCode = QrCode::factory()->create();
        $other = User::factory()->create();
        $base = "/api/v1/qr-codes/{$qrCode->uuid}";

        foreach ([['get', $base], ['patch', $base], ['delete', $base], ['get', "$base/preview"], ['get', "$base/download/png"]] as [$method, $uri]) {
            $this->actingAs($other)->json(strtoupper($method), $uri, $method === 'patch' ? ['name' => 'Hack'] : [])->assertForbidden();
        }
    }

    public function test_owner_can_preview_and_download_png_and_svg(): void
    {
        $user = User::factory()->create();
        $qrCode = QrCode::factory()->for($user)->create(['name' => 'Meu Site']);
        $base = "/api/v1/qr-codes/{$qrCode->uuid}";

        $this->actingAs($user)->get("$base/preview")->assertOk()->assertHeader('Content-Type', 'image/svg+xml; charset=UTF-8')->assertSee('<svg', false);
        $this->actingAs($user)->get("$base/download/svg")->assertOk()->assertDownload('meu-site-qr-code.svg');
        $this->actingAs($user)->get("$base/download/png")->assertOk()->assertDownload('meu-site-qr-code.png');
    }

    public function test_live_preview_supports_every_type_without_persisting(): void
    {
        $user = User::factory()->create();
        $contents = [
            'url' => ['url' => 'https://example.com'],
            'text' => ['text' => 'Conteúdo de teste'],
            'email' => ['email' => 'contato@example.com', 'subject' => 'Olá', 'body' => 'Mensagem'],
            'phone' => ['phone' => '+55 11 99999-9999'],
            'whatsapp' => ['phone' => '+55 11 99999-9999', 'message' => 'Olá'],
            'wifi' => ['ssid' => 'Minha Rede', 'password' => 'segredo', 'encryption' => 'WPA', 'hidden' => false],
        ];

        foreach ($contents as $type => $content) {
            $this->actingAs($user)->post('/api/v1/qr-codes/preview', [
                'type' => $type,
                'content' => $content,
                'foreground_color' => '#123456',
                'background_color' => '#FFFFFF',
                'size' => 512,
                'margin' => 4,
                'error_correction_level' => 'M',
            ])->assertOk()->assertHeader('Content-Type', 'image/svg+xml; charset=UTF-8')->assertSee('<svg', false);
        }

        $this->assertDatabaseCount('qr_codes', 0);
    }

    public function test_live_preview_requires_authentication_and_valid_type_content(): void
    {
        $payload = ['type' => 'invalid', 'content' => []];
        $this->postJson('/api/v1/qr-codes/preview', $payload)->assertUnauthorized();
        $this->actingAs(User::factory()->create())->postJson('/api/v1/qr-codes/preview', $payload)
            ->assertUnprocessable()->assertJsonValidationErrors('type');
    }

    public function test_creation_applies_customization_and_ignores_user_id(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $this->actingAs($user)->postJson('/api/v1/qr-codes', [
            'name' => 'Personalizado', 'type' => 'url', 'content' => ['url' => 'https://example.com'],
            'foreground_color' => '#123456', 'background_color' => '#FEDCBA', 'size' => 768,
            'margin' => 8, 'error_correction_level' => 'H', 'user_id' => $other->id,
        ])->assertCreated()->assertJsonPath('data.margin', 8);

        $this->assertDatabaseHas('qr_codes', ['user_id' => $user->id, 'margin' => 8, 'foreground_color' => '#123456']);
        $this->assertDatabaseMissing('qr_codes', ['user_id' => $other->id]);
    }
}
