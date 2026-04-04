<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StorageHelper
{
    /**
     * Guarda un archivo en la tabla polimórfica soportes.
     * * @param \Illuminate\Http\UploadedFile $file El archivo del request
     * @param string $folder Carpeta en storage (ej: 'productos')
     * @param string $modelType Nombre identificador (ej: 'comercio', 'producto')
     * @param int $modelId ID del registro padre
     * @param int $tipoId ID de cfmaestras para el tipo de soporte
     * @param string|null $descripcion
     */
    public static function save($file, $folder, $modelType, $modelTypeId, $tipoId, $descripcion = null)
    {
        if (!$file) return null;

        // 1. Si es predeterminado, desactivamos los anteriores del mismo tipo para ese modelo
        DB::table('soportes')
            ->where('model_type', $modelType)
            ->where('model_type_id', $modelTypeId)
            ->where('tipo_id', $tipoId)
            ->update(['predeterminado' => 0, 'estado' => 0]);

        // 2. Subir archivo físicamente
        $path = $file->store($folder, 'public');

        // 3. Crear registro en BD
        return DB::table('soportes')->insertGetId([
            'descripcion'    => $descripcion ?? "Soporte de $modelType",
            'ruta'           => $path,
            'predeterminado' => 1,
            'estado'         => 1,
            'model_type'     => $modelType,
            'model_type_id'  => $modelTypeId,
            'tipo_id'        => $tipoId,
            'fecha'          => now(),
            'created_by'     => Auth::id() ?? 1,
            'created_at'     => now(),
        ]);
    }
}