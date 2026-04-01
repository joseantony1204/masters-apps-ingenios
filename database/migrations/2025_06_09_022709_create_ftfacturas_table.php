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
        Schema::dropIfExists('ftresoluciones');
        Schema::create('ftresoluciones', function (Blueprint $table) {
            $table->id();
            $table->string('numero');
            $table->date('fecha')->comment('Fehca de expedición');
            $table->string('prefijo');
            $table->string('desde');
            $table->string('hasta');
            $table->string('actual')->nullable();
            $table->boolean('advertirescacez')->default(0);
            $table->text('descripcion')->nullable();
            $table->date('fechafinal')->comment('Fehca de vencimiento')->nullable();
            $table->boolean('estado')->default(1);
            
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

        Schema::dropIfExists('ftterminales');
        Schema::create('ftterminales', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->string('nombre');
            $table->unsignedBigInteger('sede_id');
            $table->unsignedBigInteger('resolucion_id');
            $table->boolean('estado')->default(1);

            $table->foreign('sede_id')->references('id')
                                        ->on('cfsedes')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('resolucion_id')->references('id')
                                        ->on('ftresoluciones')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::dropIfExists('ftturnos');
        Schema::create('ftturnos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->nullable();
            $table->string('descripcion')->nullable()->comment('Nombre');
            $table->string('observaciones')->nullable();
            $table->float('baseinicial', 10, 2);
            $table->date('fecha')->comment('Fecha');
            $table->datetime('fechaapertura')->comment('Fecha apertura');
            $table->datetime('fechacierre')->comment('Fecha cierre')->nullable();

            $table->unsignedBigInteger('persona_id');
            $table->unsignedBigInteger('terminal_id');
            $table->unsignedBigInteger('estado_id');

            $table->foreign('persona_id')->references('id')
                                        ->on('personas')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('terminal_id')->references('id')
                                        ->on('ftterminales')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('estado_id')->references('id')
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

        Schema::dropIfExists('ftfacturas');
        Schema::create('ftfacturas', function (Blueprint $table) {
            $table->id();
            $table->string('codigoseguridad');
            $table->string('numero')->nullable();
            $table->datetime('fecha')->comment('Fecha');
            $table->datetime('fechanavencimiento')->comment('Fecha vencimiento');
            $table->string('observaciones')->nullable()->comment('Observaciones');
            $table->unsignedBigInteger('model_type')->comment('Tabla Padre de donde se generala factura');
            $table->unsignedBigInteger('model_type_id')->comment('Referencia de la Tabla Padre');
        
          
            $table->unsignedBigInteger('origen_id')->nullable()->comment('Utilizado para tranferencias, sede origen');
            $table->unsignedBigInteger('destino_id')->nullable()->comment('Utilizado para tranferencias, sede destino');

            $table->unsignedBigInteger('tipo_id');
            $table->unsignedBigInteger('turno_id');
            $table->unsignedBigInteger('estado_id');

            $table->foreign('turno_id')->references('id')
                                        ->on('ftturnos')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('tipo_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->foreign('estado_id')->references('id')
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

        Schema::dropIfExists('ftdetalles');
        Schema::create('ftdetalles', function (Blueprint $table) {
            $table->id();
            $table->string('cantidad');
            $table->string('numero')->nullable();
            $table->float('precioinicial', 10, 2);
            $table->float('preciofinal', 10, 2);
            $table->float('descuento', 10, 2);
            $table->float('totalapagar', 10, 2);
            $table->date('fecha')->comment('Fecha')->useCurrent();
            $table->string('observaciones')->nullable()->comment('Observaciones');
                   
            $table->unsignedBigInteger('producto_id');
            $table->foreign('producto_id')->references('id')
                                        ->on('productos')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('factura_id');
            $table->foreign('factura_id')->references('id')
                                        ->on('ftfacturas')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('estado_id');
            $table->foreign('estado_id')->references('id')
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

        Schema::dropIfExists('ftpagos');
        Schema::create('ftpagos', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->nullable();
            $table->date('fecha')->comment('Fecha')->useCurrent();
            $table->string('concepto')->nullable()->comment('Concepto pago');
            $table->float('total', 10, 2);

            $table->unsignedBigInteger('metodo_id');
            $table->foreign('metodo_id')->references('id')
                                        ->on('cfmaestras')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');
            
            $table->unsignedBigInteger('factura_id');
            $table->foreign('factura_id')->references('id')
                                        ->on('ftfacturas')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::dropIfExists('ftseriales');
        Schema::create('ftseriales', function (Blueprint $table) {
            $table->id();
            $table->string('serial');

            $table->unsignedBigInteger('detalle_id');
            $table->foreign('detalle_id')->references('id')
                                        ->on('ftdetalles')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::dropIfExists('ftimpuestos');
        Schema::create('ftimpuestos', function (Blueprint $table) {
            $table->id();
            $table->float('base', 10, 2);
            $table->float('valor', 10, 2);

            $table->unsignedBigInteger('detalle_id')->nullable();

            $table->unsignedBigInteger('impuesto_id');
            $table->foreign('impuesto_id')->references('id')
                                        ->on('cfimpuestos')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->unsignedBigInteger('factura_id');
            $table->foreign('factura_id')->references('id')
                                        ->on('ftfacturas')
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
        Schema::dropIfExists('ftimpuestos');
        Schema::dropIfExists('ftseriales');
        Schema::dropIfExists('ftpagos');
        Schema::dropIfExists('ftdetalles');
        Schema::dropIfExists('ftfacturas');
        Schema::dropIfExists('ftturnos');
        Schema::dropIfExists('ftterminales');
        Schema::dropIfExists('ftresoluciones');
    }
};