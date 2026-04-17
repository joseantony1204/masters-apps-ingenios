<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Comercios;
use Inertia\Inertia;

class CheckComercioStatus
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();

        // Traemos el comercio con sus suscripciones que podrían darle acceso
        $comercio = Comercios::with(['suscripciones.pagos' => function($query) {
            $query->whereIn('estado_id', [980, 981]);
        }])->where('persona_id', $user->persona_id)->first();

        if (!$comercio) {
            return $next($request);
        }

        $subs = collect($comercio->suscripciones);
        $hoy = now()->startOfDay();
        $tieneAcceso = false;

        foreach ($subs as $sub) {
            $vencimiento = \Carbon\Carbon::parse($sub->fecha_vencimiento)->startOfDay();
            $inicioPlan = \Carbon\Carbon::parse($sub->fecha_inicio)->startOfDay();
            
            $diasParaVencer = $hoy->diffInDays($vencimiento, false);
            $diasDesdeQueInicio = $inicioPlan->diffInDays($hoy, false);

            // --- REGLA 1: SUSCRIPCIÓN ACTIVA (980) ---
            if ($sub->estado_id == 980 && $diasParaVencer >= 0) {
                $tieneAcceso = true;
                break; 
            }
            
            // --- REGLA 2: SUSCRIPCIÓN PENDIENTE PAGO (981) ---
            // Condición: Que la fecha actual no sea superior a 3 días desde que inició el plan
            // Si diasDesdeQueInicio es 0, 1, 2 o 3 -> ENTRA. 
            // Si es 4 o más -> BLOQUEADO.
            if ($sub->estado_id == 981 && $diasDesdeQueInicio <= 3) {
                $tieneAcceso = true;
                break;
            }
        }

        // 5. Bloqueo si ninguna suscripción cumplió las reglas
        if (!$tieneAcceso) {
            return redirect()->route('scsuscripciones.index')
            ->with('warning', 'Servicio restringido por falta de pago. Su plazo de gracia de 3 días ha expirado.');
        }

        return $next($request);
    }
}