<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\{DB,Hash};
use Carbon\Carbon;
use Illuminate\Support\Str;

class PersonasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataPersonas = [
            ['id' => 1, 'identificacion' => '1119836516', 'direccion' =>'CARRERA 18 CON 12', 'telefonomovil' =>'3002945168', 'email' => 'ajgonzalezl@outlook.com', 'pais_id' =>807, 'departamento_id' => 810, 'ciudad_id' => 818, 'tipoidentificacion_id' => 10],
            ['id' => 2,'identificacion' => '1234567890', 'direccion' =>'CALLE 12 #11', 'telefonomovil' =>'000000', 'email' => 'desarrollo@medigroup.com', 'pais_id' =>807, 'departamento_id' => 810, 'ciudad_id' => 818, 'tipoidentificacion_id' => 10],
        ];

        $dataPersonasnaturales = [
            ['fechanacimiento' => Carbon::create('2000/01/01'), 'nombre' => 'Antonio', 'segundonombre' => 'Jose', 'apellido' => 'Gonzalez', 'segundoapellido' => 'Liñan', 'persona_id' =>1,'sexo_id' => 46],
            ['fechanacimiento' => Carbon::create('2000/01/01'), 'nombre' => 'Tester', 'segundonombre' => null, 'apellido' => 'Probador', 'segundoapellido' => null, 'persona_id' =>2, 'sexo_id' => 46],
        ];

        $dataComercios = [
            ['token' => $token = Str::uuid()->toString() . Str::random(32), 'nombre' => 'COMERCIO 1', 'objetocomercial' => 'GENERAL', 'persona_id' =>1],
        ];

        $dataSedes = [
            ['nombre' => 'SEDE 1', 'ciudad'=>'RCH', 'telefono'=>'000 000 0000', 'direccion' => 'CALLE 1', 'comercio_id' =>1],
        ];

        $dataResoluciones = [
            ['numero' => '123456789', 'fecha'=>Carbon::create('2000/01/01'), 'prefijo' => 'SETT', 'desde' => '1', 'hasta' => '500', 'actual'=> '1', 'advertirescacez'=>'1', 'created_by' => 1, 'comercio_id' =>1],
        ];

        $dataTerminales = [
            ['nombre' => 'Caja 1', 'sede_id' => 1, 'resolucion_id' => 1, 'created_by' => 1],
        ];

        foreach ($dataPersonas as $persona) {
            $persId = DB::table('personas')->insertGetId($persona);
            DB::table('users')->insert([
                'username' => $persona['identificacion'],
                'email' => $persona['email'],
                'password' => Hash::make($persona['identificacion']),
                'perfil_id' => 7,
                'persona_id' => $persId,
                'estado_id' => 850,
                'created_by' => 1
            ]);
        };

        $dataSedesUsers = [
            ['orden'=>1, 'predeterminada'=>1, 'usuario_id' => 1, 'sede_id' => 1, 'estado_id' =>858, 'created_by' => 1],
        ];

        foreach ($dataPersonasnaturales as $personanatural) {
            DB::table('personasnaturales')->insert($personanatural);
        };

        foreach ($dataComercios as $comercio) {
            DB::table('comercios')->insert($comercio);
        };

        foreach ($dataSedes as $sede) {
            DB::table('cfsedes')->insert($sede);
        };

        foreach ($dataSedesUsers as $sedeuser) {
            DB::table('cfsedesusers')->insert($sedeuser);
        };

        foreach ($dataResoluciones as $resolucion) {
            DB::table('ftresoluciones')->insert($resolucion);
        };

        foreach ($dataTerminales as $terminal) {
            DB::table('ftterminales')->insert($terminal);
        };

        /*
        *Datos por defecto de suscripciones
        */
        $dataSuscripciones = [
            ['fecha_inicio'=>Carbon::now()->format('Y/m/d'), 'fecha_vencimiento'=>Carbon::now()->addDays(15)->format('Y/m/d'), 'estado_id' => 980, 'plan_id' => 968, 'comercio_id' =>1, 'created_by' => 1],
        ];

        $dataPagos = [
            ['valor'=>0, 'fecha'=>Carbon::now(), 'estado_id' => 974, 'metodo_id' => 933, 'suscripcion_id' =>1, 'created_by' => 1],
        ];

        foreach ($dataSuscripciones as $suscripcion) {
            DB::table('scsuscripciones')->insert($suscripcion);
        };

        foreach ($dataPagos as $pago) {
            DB::table('scpagos')->insert($pago);
        };
    }
}
