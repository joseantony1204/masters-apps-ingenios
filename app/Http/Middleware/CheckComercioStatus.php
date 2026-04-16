<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Comercios;
use Inertia\Inertia;

class CheckComercioStatus
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. Verificar que haya un usuario logueado
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();

        // 2. Buscar el comercio asociado a la persona (usuario)
        $comercio = Comercios::where('persona_id', $user->persona_id)->first();

        // 3. Validar estado (851 = Suspendido/Bloqueado)
        // Usamos el operador nullsafe (?->) por si el comercio no tiene suscripción aún
        if ($comercio && $comercio->suscripcion?->estado_id === 851) {
            
            // Si la petición es de Inertia o espera JSON
            return Inertia::render('welcome', [
                'mensaje' => 'Tu servicio ha sido suspendido por falta de pago.',
                'comercio' => $comercio->nombre
            ]);
        }

        return $next($request);
    }
}