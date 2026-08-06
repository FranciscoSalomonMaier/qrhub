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
# Contrato e geração de QR Codes

## Identificador público

A API mantém o contrato compatível existente: `QrCodeResource.id` contém o UUID
público, e não a chave numérica interna. O route model binding também resolve
`QrCode` por `uuid`. O frontend centraliza a leitura em `qrCodeUuid`, que aceita
um futuro campo aditivo `uuid` sem quebrar respostas atuais.

## Preview e downloads

- Preview ao vivo: `POST /api/v1/qr-codes/preview`, SVG de 320 px, sem persistência.
- Preview salvo: `GET /api/v1/qr-codes/{uuid}/preview`.
- Downloads: `GET /api/v1/qr-codes/{uuid}/download/png` e `/svg`.

Downloads retornam `Content-Disposition: attachment`, `image/png` ou
`image/svg+xml`, e exigem sessão Sanctum e autorização do proprietário.

## Formato dos módulos

A versão instalada de `endroid/qr-code` gera módulos quadrados nos writers PNG e
SVG. `RoundBlockSizeMode` trata o arredondamento do tamanho calculado de cada
bloco, não sua forma geométrica. Por isso, o formato efetivamente suportado é
somente `square`. Não são expostas opções `rounded`, `dots`, `classy` ou similares,
nem foi criada uma coluna sem efeito visual. Para oferecer esses estilos, os dois
writers devem ser substituídos ou estendidos em conjunto e validados quanto à
leitura dos códigos.
