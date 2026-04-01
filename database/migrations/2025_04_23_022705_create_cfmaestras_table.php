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
        Schema::dropIfExists('cfmaestras');
        Schema::create('cfmaestras', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->string('nombre');
            $table->unsignedBigInteger('padre')->comment('Llave foranea del padre')->nullable();
            $table->unsignedBigInteger('jerarquia')->nullable();
            $table->string('orden',3)->nullable();
            $table->boolean('visible')->default(1);
            $table->string('observacion')->nullable();
            
            $table->timestamp('created_at', $precision = 0);
            $table->unsignedBigInteger('created_by')->default(2);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::dropIfExists('cfimpuestos');
        Schema::create('cfimpuestos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->float('valor', 10, 2);
            $table->boolean('activo')->default(1);

            $table->unsignedBigInteger('tipo_id');
            $table->foreign('tipo_id')->references('id')
                                        ->on('cfmaestras')
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
        Schema::dropIfExists('cfimpuestos');
        Schema::dropIfExists('cfmaestras');
    }
};
