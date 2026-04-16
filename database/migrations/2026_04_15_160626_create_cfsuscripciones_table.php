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
        Schema::create('scsuscripciones', function (Blueprint $table) {
            $table->id();
           
            $table->date('fecha_inicio');
            $table->date('fecha_vencimiento');
            $table->unsignedBigInteger('ultimo_pago_id')->nullable();

            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('plan_id');
            $table->foreign('plan_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('comercio_id');
            $table->foreign('comercio_id')->references('id')
                                        ->on('comercios')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            
            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

        });

        Schema::create('scpagos', function (Blueprint $table) {
            $table->id();
            $table->decimal('valor', 15, 2); // 10.00 o 5000.00
            $table->date('fecha')->useCurrent();
            $table->string('referencia_pasarela')->nullable();
            
            
            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('metodo_id');
            $table->foreign('metodo_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('suscripcion_id');
            $table->foreign('suscripcion_id')->references('id')
                                        ->on('scsuscripciones')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

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
        Schema::dropIfExists('scpagos');
        Schema::dropIfExists('scsuscripciones');
    }
};
