<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $comercioId = null;

        // Si hay un usuario logueado, buscamos el comercio asociado a su persona_id
        if ($user) {
            $comercioId = \App\Models\Comercios::where('persona_id', $user->persona_id)
                ->value('id'); // 'value' obtiene directamente el ID sin cargar todo el modelo
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
                'comercio_id' => $comercioId, // Ya lo tienes global en el frontend
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'info'   => fn () => $request->session()->get('info'),
                'warning'   => fn () => $request->session()->get('warning'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ]);
    }
}
