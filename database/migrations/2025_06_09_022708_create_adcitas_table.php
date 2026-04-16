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
        Schema::dropIfExists('adclientes');
        Schema::create('adclientes', function (Blueprint $table) {
            $table->id();
            $table->date('fechaingreso', $precision = 0)->useCurrent()->comment('Fecha ingreso')->nullable();

            $table->unsignedBigInteger('persona_id');
            $table->foreign('persona_id')->references('id')
                                        ->on('personas')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('referido_id')->nullable();
            
            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('comercio_id');

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(2);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();                            

        });


        Schema::dropIfExists('adcitas');
        Schema::create('adcitas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo');
            $table->date('fecha')->comment('Fecha de cita');
            $table->time('horainicio')->comment('Hora inicio');
            $table->time('horafinal')->comment('Hora final');
            $table->text('descripcion')->nullable();
            $table->text('motivocancelar')->nullable();
            $table->text('cupon_id')->nullable()->comment('Para cuando el cliente se le haga un descuento');

            $table->unsignedBigInteger('cliente_id');
            $table->foreign('cliente_id')->references('id')
                                        ->on('adclientes')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            
            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(2);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();                            

        });

        Schema::dropIfExists('addetallescitas');
        Schema::create('addetallescitas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cantidad')->default(1);
            $table->float('descuento', 10, 2)->comment('Descuento del servicio para el cliente, aplicando el cupon de la cita');
            $table->float('preciounitario', 10, 2)->comment('Precio unitario del servicio para el cliente');
            $table->float('preciofinal', 10, 2)->comment('Precio final del servicio para el cliente');
            $table->timestamp('fechacreado', $precision = 0)->useCurrent();

            $table->unsignedBigInteger('model_type')->comment('Tabla Padre de donde se generala factura');
            $table->unsignedBigInteger('model_type_id')->comment('Referencia de la Tabla Padre');

            $table->unsignedBigInteger('cita_id');
            $table->unsignedBigInteger('estado_id');

            $table->foreign('cita_id')->references('id')
                                        ->on('adcitas')
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

        Schema::dropIfExists('adreseñas');
        Schema::create('adreseñas', function (Blueprint $table) {
            $table->id();
            $table->string('valoracion',5)->comment('valoracion')->nullable();
            $table->timestamp('fecha', $precision = 0)->useCurrent();

            $table->unsignedBigInteger('detallecita_id');

            $table->foreign('detallecita_id')->references('id')
                                        ->on('addetallescitas')
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
        Schema::dropIfExists('addetallescitas');
        Schema::dropIfExists('adreseñas');
        Schema::dropIfExists('adcitas');
        Schema::dropIfExists('adclientes');
    }
};