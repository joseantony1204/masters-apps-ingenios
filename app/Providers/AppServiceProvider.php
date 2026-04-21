<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\{User,Ftfacturas};
use Illuminate\Support\Facades\Event; // <-- IMPORTANTE
use App\Events\AdcitasEvent;
use App\Listeners\SendWhatsAppCitaCreated;
use \App\Observers\FtfacturasObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        Inertia::share([
            'user' => fn () => Auth::check() ? [
                'id' => Auth::user()->id,
                'username' => Auth::user()->username,
                'email' => Auth::user()->email,
                'telefonomovil' => Auth::user()->telefonomovil,
                'modulos' => Auth::user()->modulos->map(function ($modulo) {
                    return [
                        'id' => $modulo->id,
                        'nombre' => Str::ucfirst(Str::lower($modulo->nombre)),
                        'icon' => $modulo->icon,
                        'roles' => app(User::class)->getroles($modulo->id)->map(function ($rol) {
                            return [
                                'nombre' => Str::ucfirst(Str::lower($rol->nombre)),
                                //'ruta' => route(Str::lower($rol->codigo) . '.' . Str::lower($rol->index)),
                                'icon' => $rol->icon,
                                'ruta' => route(Str::lower($rol->codigo) . '.' . Str::lower($rol->index)),
                                'ruta_name' => Str::lower($rol->codigo) . '.' . Str::lower($rol->index),
                            ];
                        }),
                    ];
                }),
            ] : null,
        ]);
        Ftfacturas::observe(FtfacturasObserver::class);
    }
}


