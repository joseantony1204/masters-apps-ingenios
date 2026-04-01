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
        Schema::dropIfExists('personas');
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->string('identificacion',50)->unique()->comment('Identificacion');
            $table->string('digitoverificacion',50)->unique()->comment('Digito Verificación')->nullable();
            $table->string('lugarexpedicion',50)->comment('lugar de expedición')->nullable();
            $table->date('fechaexpedicion')->comment('Fehca de expedición')->nullable();
  
            
            $table->string('telefono',50)->comment('Telefono fijo')->nullable();
            $table->string('telefonomovil',50)->comment('Telefono movil')->nullable();
            $table->boolean('sendsms')->default(false)->comment('Enviar sms')->nullable();
            $table->string('email',50)->comment('Email')->nullable();
            $table->boolean('sendemail')->default(false)->comment('Enviar email')->nullable();

            $table->text('foto')->nullable();
            $table->text('firma')->nullable();

            $table->string('direccion',150)->comment('Direccion')->nullable();
            $table->unsignedBigInteger('pais_id')->nullable();
            $table->unsignedBigInteger('departamento_id')->nullable();
            $table->unsignedBigInteger('ciudad_id')->nullable();
            $table->string('barrio',100)->nullable();
            
            $table->unsignedBigInteger('tipoidentificacion_id');
            $table->unsignedBigInteger('tiporegimen_id')->nullable();
            $table->text('observaciones')->nullable();
            
            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

        });

        Schema::dropIfExists('personasnaturales');
        Schema::create('personasnaturales', function (Blueprint $table) {
            $table->id();

            $table->string('nombre',50)->comment('nombre');
            $table->string('segundonombre',50)->nullable()->comment('segundo nombre');
            $table->string('apellido',50)->comment('apellido');
            $table->string('segundoapellido',50)->nullable()->comment('segundo apellido');
            $table->date('fechanacimiento')->comment('Fecha nacmiento');

            $table->unsignedBigInteger('persona_id');
            $table->foreign('persona_id')->references('id')
                                        ->on('personas')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            
            $table->unsignedBigInteger('zona_id')->nullable();
            $table->unsignedBigInteger('sexo_id');
            $table->unsignedBigInteger('estadocivil_id')->nullable();
            $table->unsignedBigInteger('niveleducacion_id')->nullable();
            $table->unsignedBigInteger('religion_id')->nullable();
            $table->unsignedBigInteger('etnia_id')->nullable();
            $table->unsignedBigInteger('tiposangre_id')->nullable();
            $table->unsignedBigInteger('rh_id')->nullable();
            $table->unsignedBigInteger('ocupacion_id')->nullable();
            $table->unsignedBigInteger('estrato_id')->nullable();
            $table->unsignedBigInteger('discapacidad_id')->nullable();
            $table->text('observaciones')->nullable();

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();  

        });

        Schema::dropIfExists('comercios');
        Schema::create('comercios', function (Blueprint $table) {
            $table->id();

            $table->string('nombre',50)->comment('nombre');
            $table->string('objetocomercial',50)->nullable()->comment('objeto comercial');
            
            $table->unsignedBigInteger('persona_id');
            $table->foreign('persona_id')->references('id')
                                        ->on('personas')
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

        Schema::dropIfExists('cfsedes');
        Schema::create('cfsedes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->comment('Nombre');
            $table->string('ciudad',20)->comment('Ciudad');
            $table->string('direccion',80)->comment('Direccion');
            $table->string('email',80)->comment('Email')->nullable();
            $table->unsignedBigInteger('comercio_id')->comment('Código del comercio');
            $table->boolean('estado')->default(1);
            
            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('comercio_id')->references('id')
                                        ->on('comercios')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
        });
    }

    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cfsedes');
        Schema::dropIfExists('comercios');
        Schema::dropIfExists('personasnaturales');
        Schema::dropIfExists('personas');
    }
};
