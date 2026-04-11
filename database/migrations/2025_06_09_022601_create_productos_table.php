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
        Schema::dropIfExists('productos');
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->string('codigobarra')->nullable();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('minimostock')->default(10)->nullable();
            $table->string('precioingreso');
            $table->string('preciosalida');
            $table->boolean('acumulapuntos')->default(0)->nullable();
            $table->text('observacion')->nullable();
            $table->text('duracion')->comment('Duracion para cuando sea servicio')->nullable();
            $table->unsignedBigInteger('padre')->comment('Llave foranea del padre')->nullable();

            $table->unsignedBigInteger('tipo_id');
            $table->foreign('tipo_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('unidad_id')->nullable();
            $table->foreign('unidad_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('ubicacion_id')->nullable();

            $table->unsignedBigInteger('impuesto_id')->nullable();                           
            $table->foreign('impuesto_id')->references('id')
                                        ->on('cfimpuestos')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->unsignedBigInteger('marca_id')->nullable();
            $table->unsignedBigInteger('sede_id');
            $table->foreign('sede_id')->references('id')
                                        ->on('cfsedes')
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

        Schema::dropIfExists('imagenesproductos');
        Schema::create('imagenesproductos', function (Blueprint $table) {
            $table->id();
            $table->string('ruta');
            $table->boolean('principal')->default(0);
            $table->string('observacion')->nullable();

            $table->unsignedBigInteger('producto_id');
            $table->foreign('producto_id')->references('id')
                                        ->on('productos')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            
            $table->timestamp('created_at', $precision = 0);
            $table->unsignedBigInteger('created_by')->default(2);
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
        Schema::dropIfExists('imagenesproductos');
        Schema::dropIfExists('productos');
    }
};
