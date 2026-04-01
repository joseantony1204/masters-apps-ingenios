<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfiguracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataCfimpuestos = [
            [ 'id' => 1, 'codigo' => 'ZZ', 'nombre' => 'Excluido', 'descripcion' => 'Producto Excento', 'valor' => 0, 'activo' => 1, 'tipo_id'=> 888],
            [ 'id' => 2, 'codigo' => '01', 'nombre' => 'Impuesto advalorem', 'descripcion' => 'Impuesto al Valor Agregado', 'valor' => 6, 'activo' => 1, 'tipo_id'=> 885],
            [ 'id' => 3, 'codigo' => '01', 'nombre' => 'Iva', 'descripcion' => 'Impuesto al Valor Agregado', 'valor' => 19, 'activo' => 1, 'tipo_id'=> 885],
            [ 'id' => 4, 'codigo' => NULL, 'nombre' => 'ReteIva', 'descripcion' => 'ReteIva', 'valor' => 15, 'activo' => 1, 'tipo_id'=> 886],
            [ 'id' => 5, 'codigo' => NULL, 'nombre' => 'ReteIca', 'descripcion' => 'ReteIca', 'valor' => 0, 'activo' => 1, 'tipo_id'=> 887],
            [ 'id' => 6, 'codigo' => '01', 'nombre' => 'Retencion en la fuente', 'descripcion' => 'Retencion en la fuente', 'valor' => 2.5, 'activo' => 1, 'tipo_id'=> 886],
  
        ];
        foreach (array_chunk($dataCfimpuestos,1000) as $data){
            DB::table('cfimpuestos')->insert($data);
        }
    }
}