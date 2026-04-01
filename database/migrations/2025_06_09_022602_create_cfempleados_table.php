<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('cfempleados');
        Schema::create('cfempleados', function (Blueprint $table) {
            $table->id();
            $table->date('fechaingreso')->comment('Fecha ingreso');

            $table->unsignedBigInteger('comercio_id');
            $table->unsignedBigInteger('persona_id');
            $table->foreign('persona_id')->references('id')
                                        ->on('personas')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            
          
            $table->text('observaciones')->nullable();

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();  

        });

        Schema::dropIfExists('cfempleadosservicios');
        Schema::create('cfempleadosservicios', function (Blueprint $table) {
            $table->id();
            $table->float('preciopersonalizado', 10, 2)->comment('Precio del servicio que cobra el empleado');
            $table->string('duracionpersonalizado',3)->comment('Duracion del servicio por el empleado');
            $table->timestamp('fechacreado', $precision = 0)->useCurrent();
            $table->string('comision')->nullable();

            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('servicio_id');
            $table->unsignedBigInteger('estado_id');

            $table->foreign('empleado_id')->references('id')
                                        ->on('cfempleados')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('servicio_id')->references('id')
                                        ->on('productos')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('estado_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
          
            $table->text('observaciones')->nullable();

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();  

        });

        Schema::dropIfExists('cfhorarios');
        Schema::create('cfhorarios', function (Blueprint $table) {
            $table->id();
            $table->time('horainicio')->comment('Hora en que el empleado ingresa a laborar');
            $table->time('horafinal')->comment('Hora en que el empleado ingresa a laborar');
            $table->boolean('estado')->default(1);

            $table->unsignedBigInteger('empleado_id');
            $table->foreign('empleado_id')->references('id')
                                        ->on('cfempleados')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('dia_id');
            $table->foreign('dia_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();  

        });

        Schema::dropIfExists('cfbloqueosagendas');
        Schema::create('cfbloqueosagendas', function (Blueprint $table) {
            $table->id();
            $table->date('fecha')->comment('fecha para bloquear');
            $table->time('horainicio')->comment('Hora empieza bloque');
            $table->time('horafinal')->comment('Hora termina bloqueo');

            $table->unsignedBigInteger('empleado_id');
            $table->unsignedBigInteger('motivo_id');

            $table->foreign('motivo_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('empleado_id')->references('id')
                                        ->on('cfempleados')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            
            $table->text('observaciones')->nullable();

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();  

        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cfbloqueosagendas');
        Schema::dropIfExists('cfhorarios');
        Schema::dropIfExists('cfempleadosservicios');
        Schema::dropIfExists('cfempleados');
    }
};