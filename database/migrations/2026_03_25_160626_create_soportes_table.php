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
        Schema::create('soportes', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion')->nullable()->comment('Descripción del soporte');
            $table->string('ruta')->comment('Ruta del soporte');
            $table->string('predeterminado')->default(1)->nullable()->comment('Indica si el soporte es predeterminado');
            $table->datetime('fecha')->comment('Fecha')->useCurrent();
            $table->boolean('estado')->default(1)->nullable()->comment('Estado del soporte');
            
            $table->unsignedBigInteger('model_type')->comment('Tabla Padre de donde se generala factura');
            $table->unsignedBigInteger('model_type_id')->comment('Referencia de la Tabla Padre');

            $table->unsignedBigInteger('tipo_id')->comment('Tipo de soporte, referencia a cfmaestras tipo soporte');
            $table->foreign('tipo_id')->references('id')
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soportes');
    }
};
