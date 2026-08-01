# Módulo de QR Codes

Todos os endpoints exigem sessão Sanctum e usam a base `/api/v1/qr-codes`. Os identificadores nas URLs são UUIDs.

| Método | Endpoint | Uso |
|---|---|---|
| GET / POST | `/qr-codes` | Listar / criar |
| GET / PUT / PATCH / DELETE | `/qr-codes/{uuid}` | Detalhar / atualizar / excluir |
| PATCH | `/qr-codes/{uuid}/status` | Ativar ou desativar |
| GET | `/qr-codes/{uuid}/preview` | Prévia SVG |
| GET | `/qr-codes/{uuid}/download/png` | Download PNG |
| GET | `/qr-codes/{uuid}/download/svg` | Download SVG |

A listagem aceita `page`, `per_page` (1–100), `search`, `type`, `status` (`active`/`inactive`), `sort` (`name`, `type`, `created_at`, `updated_at`) e `direction` (`asc`/`desc`). O padrão é criação decrescente.

Tipos e conteúdo: `url` (`{"url":"https://example.com"}`), `text` (`{"text":"Olá"}`), `email` (`email`, `subject`, `body`), `phone` (`phone`), `whatsapp` (`phone`, `message`) e `wifi` (`ssid`, `password`, `encryption`, `hidden`).

Exemplo:

```json
{
  "name": "Meu site",
  "type": "url",
  "content": { "url": "https://example.com" },
  "foreground_color": "#000000",
  "background_color": "#FFFFFF",
  "size": 512,
  "error_correction_level": "M",
  "is_active": true
}
```

WhatsApp:

```json
{
  "name": "WhatsApp comercial",
  "type": "whatsapp",
  "content": { "phone": "+5551999999999", "message": "Olá, gostaria de mais informações." }
}
```

## Execução

```bash
cd backend
php artisan migrate
php artisan db:seed --class=QrCodeSeeder
php artisan test
./vendor/bin/pint --test

cd ../frontend
npm run lint
npm run build
```

Na interface autenticada, use **Meus QR Codes** para pesquisar, filtrar, ordenar e paginar; **Criar QR Code** abre o formulário. A tela de detalhes oferece cópia, status, exclusão e downloads. O seeder é apenas para desenvolvimento e não deve ser executado automaticamente em produção.
