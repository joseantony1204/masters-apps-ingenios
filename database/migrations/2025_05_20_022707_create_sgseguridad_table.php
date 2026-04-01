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
        Schema::dropIfExists('sgrolesperfiles');
        Schema::create('sgrolesperfiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('perfil_id');
            $table->unsignedBigInteger('rol_id');
            $table->boolean('estado')->default(1);
            $table->string('observacion')->nullable();
            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(2);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('perfil_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            $table->foreign('rol_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
        });

        Schema::dropIfExists('sgpermisos');
        Schema::create('sgpermisos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rolperfil_id');
            $table->unsignedBigInteger('vista_id');
            $table->boolean('estado')->default(1);
            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(2);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('rolperfil_id')->references('id')
                                        ->on('sgrolesperfiles')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            $table->foreign('vista_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sgpermisos');
        Schema::dropIfExists('sgrolesperfiles');
    }
};
