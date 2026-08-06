<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\QrCodeType;
use App\Http\Controllers\Controller;
use App\Http\Requests\QrCodes\PreviewQrCodeRequest;
use App\Http\Requests\QrCodes\StoreQrCodeRequest;
use App\Http\Requests\QrCodes\UpdateQrCodeRequest;
use App\Http\Requests\QrCodes\UpdateQrCodeStatusRequest;
use App\Http\Resources\QrCodeCollection;
use App\Http\Resources\QrCodeResource;
use App\Models\QrCode;
use App\Services\QrCodes\QrCodeGeneratorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class QrCodeController extends Controller
{
    public function index(Request $request): QrCodeCollection
    {
        Gate::authorize('viewAny', QrCode::class);
        $validated = validator($request->query(), [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'search' => ['sometimes', 'string', 'max:120'],
            'type' => ['sometimes', Rule::enum(QrCodeType::class)],
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
            'sort' => ['sometimes', Rule::in(['name', 'type', 'created_at', 'updated_at'])],
            'direction' => ['sometimes', Rule::in(['asc', 'desc'])],
        ])->validate();

        $query = $request->user()->qrCodes()
            ->when($validated['search'] ?? null, fn ($q, $search) => $q->where('name', 'like', '%'.addcslashes($search, '%_\\').'%'))
            ->when($validated['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->when(isset($validated['status']), fn ($q) => $q->where('is_active', $validated['status'] === 'active'))
            ->orderBy($validated['sort'] ?? 'created_at', $validated['direction'] ?? 'desc')
            ->orderBy('id', $validated['direction'] ?? 'desc');

        return new QrCodeCollection($query->paginate($validated['per_page'] ?? 12)->withQueryString());
    }

    public function store(StoreQrCodeRequest $request): Response|QrCodeResource
    {
        Gate::authorize('create', QrCode::class);
        $data = $request->validated();
        $name = $data['name'];
        $qrCode = $request->user()->qrCodes()->create(array_merge([
            'uuid' => (string) Str::uuid(),
            'slug' => $this->uniqueSlug($name),
            'foreground_color' => '#000000',
            'background_color' => '#FFFFFF',
            'size' => 512,
            'margin' => 4,
            'error_correction_level' => 'M',
            'is_active' => true,
            'is_dynamic' => false,
        ], $data));

        return (new QrCodeResource($qrCode))->response()->setStatusCode(201);
    }

    public function show(QrCode $qrCode): QrCodeResource
    {
        Gate::authorize('view', $qrCode);

        return new QrCodeResource($qrCode);
    }

    public function update(UpdateQrCodeRequest $request, QrCode $qrCode): QrCodeResource
    {
        Gate::authorize('update', $qrCode);
        $qrCode->update($request->validated());

        return new QrCodeResource($qrCode->refresh());
    }

    public function destroy(QrCode $qrCode): Response
    {
        Gate::authorize('delete', $qrCode);
        $qrCode->delete();

        return response()->noContent();
    }

    public function status(UpdateQrCodeStatusRequest $request, QrCode $qrCode): QrCodeResource
    {
        Gate::authorize('update', $qrCode);
        $qrCode->update($request->validated());

        return new QrCodeResource($qrCode->refresh());
    }

    public function preview(PreviewQrCodeRequest $request, QrCodeGeneratorService $generator): Response
    {
        $qrCode = new QrCode(array_merge([
            'foreground_color' => '#000000',
            'background_color' => '#FFFFFF',
            'size' => 512,
            'margin' => 4,
            'error_correction_level' => 'M',
        ], array_merge($request->validated(), ['size' => 320])));

        return $this->svgResponse($generator->generate($qrCode, 'svg'));
    }

    public function savedPreview(QrCode $qrCode, QrCodeGeneratorService $generator): Response
    {
        Gate::authorize('view', $qrCode);

        return $this->svgResponse($generator->generate($qrCode, 'svg'));
    }

    public function download(QrCode $qrCode, string $format, QrCodeGeneratorService $generator): Response
    {
        Gate::authorize('view', $qrCode);
        abort_unless(in_array($format, ['png', 'svg'], true), 404);
        $mime = $format === 'png' ? 'image/png' : 'image/svg+xml';
        $filename = Str::slug($qrCode->name).'-qr-code.'.$format;

        return response($generator->generate($qrCode, $format), 200, ['Content-Type' => $mime, 'Content-Disposition' => 'attachment; filename="'.$filename.'"', 'X-Content-Type-Options' => 'nosniff']);
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'qr-code';
        do {
            $slug = $base.'-'.Str::lower(Str::random(6));
        } while (QrCode::withTrashed()->where('slug', $slug)->exists());

        return $slug;
    }

    private function svgResponse(string $svg): Response
    {
        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml; charset=UTF-8',
            'Content-Security-Policy' => "default-src 'none'; style-src 'unsafe-inline'",
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
