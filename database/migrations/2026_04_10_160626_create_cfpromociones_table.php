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
        Schema::create('cfpromociones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: Descuento por Cliente Fiel
            $table->enum('categoria', ['flash' , 'cumple' , 'vip' , 'recurrente', 'general']); // categorias
            $table->text('descripcion')->nullable();
            $table->enum('tipo_descuento', ['porcentaje', 'fijo']); // % o monto
            $table->decimal('valor', 15, 2); // 10.00 o 5000.00
            $table->decimal('compra_minima', 15, 2)->nullable()->default(0); // Para que no apliquen cupones en ventas pequeñas
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->boolean('estado')->default(true);

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

        Schema::create('cfcupones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promocion_id')->constrained('cfpromociones')->onDelete('cascade');
            $table->string('codigo')->unique(); // Ej: BDAY-2026-X
            
            // Si es NULL, cualquier persona puede usarlo. Si tiene ID, solo ese persona.
            $table->unsignedBigInteger('persona_id')->nullable(); 
            
            $table->integer('limite_uso_total')->default(1); // Cuántas veces se puede usar el cupón en general
            $table->integer('limite_uso_por_persona')->default(1); // Cuántas veces lo puede usar el mismo persona
            $table->integer('usos_actuales')->default(0);
            
            $table->boolean('es_automatico')->default(false); // ¿Lo creó el sistema por una regla?
            $table->timestamp('fechavence')->nullable(); // Fecha específica de expiración del cupón
            
            $table->timestamp('created_at', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('created_by')->default(1);
            $table->timestamp('updated_at', $precision = 0)->useCurrentOnUpdate()->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamp('deleted_at', $precision = 0)->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            
            // Index para búsqueda rápida de códigos
            $table->index('codigo');
        });

        Schema::create('cfcupon_historial', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cupon_id')->constrained('cfcupones');
            $table->foreignId('persona_id')->constrained('personas'); // Ajusta a tu tabla de clientes
            $table->foreignId('factura_id')->nullable()->constrained('ftfacturas'); // Relación con la venta
            $table->decimal('descuento_aplicado', 15, 2); // Cuánto se ahorró realmente

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
        Schema::dropIfExists('cfcupon_historial');
        Schema::dropIfExists('cfcupones');
        Schema::dropIfExists('cfpromociones');
    }
};
