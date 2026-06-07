<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('adresenas');
        Schema::create('adresenas', function (Blueprint $table) {
            $table->id();
            $table->integer('estrellas')->unsigned(); // 1 a 5
            $table->text('comentario')->nullable();
            $table->string('token', 64)->unique(); // Token único para la URL de WhatsApp
            $table->timestamp('fecha')->nullable();

            $table->unsignedBigInteger('persona_id');
            $table->foreign('persona_id')->references('id')
                                        ->on('personas')
                                        ->onDelete('restrict')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('detalle_id');
            $table->foreign('detalle_id')->references('id')
                                        ->on('ftdetalles')
                                        ->onDelete('restrict')
                                        ->onUpdate('cascade');
           

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(2);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();                            

        });
    }

    public function down()
    {
        Schema::dropIfExists('adresenas');
    }
};
