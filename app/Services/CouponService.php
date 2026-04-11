<?php
namespace App\Services;

use App\Models\Cfcupones;
use App\Models\CfPromociones;
use Illuminate\Support\Str;

class CouponService
{
    public function generateForPersona($personaId, $categoria, $comercioId)
    {
        // 1. Buscamos la promoción activa de esa categoría
        $promo = CfPromociones::where('categoria', $categoria)
                               ->where('comercio_id', $comercioId)
                               ->where('estado', 1)
                               ->first();
        if (!$promo) return null;

        // VALIDACIÓN CRÍTICA: ¿Ya tiene un cupón activo de esta categoría hoy?
        $existe = Cfcupones::where('persona_id', $personaId)
        ->where('promocion_id', $promo->id)
        ->where('usos_actuales', 0) // O tu lógica de "no usado"
        ->whereDate('created_at', now()->today())
        ->exists();

        if ($existe) return null;

        // 2. Creamos el cupón único
        return Cfcupones::create([
            'promocion_id' => $promo->id,
            'persona_id'   => $personaId,
            'codigo'       => strtoupper(substr($categoria, 0, 3) . '-' . Str::random(6)),
            'limite_uso_total' => 1,
            'limite_uso_por_persona' => 1,
            'usos_actuales' => 0,
            'es_automatico' => 1,
            'fechavence'    => now()->addDays(30), // Vence en un mes
        ]);
    }
}
?>