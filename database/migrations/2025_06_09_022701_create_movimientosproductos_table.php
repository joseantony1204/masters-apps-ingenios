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
        
        Schema::table('productos', function (Blueprint $table) {
            if (!Schema::hasColumn('productos', 'stock')) {
                $table->integer('stock')->default(0)->after('minimostock');
            }
        });

        Schema::table('ftdetalles', function (Blueprint $table) {
            if (!Schema::hasColumn('ftdetalles', 'porcentajedescuento')) {
                $table->integer('porcentajedescuento')->nullable()->default(0)->after('descuento');
                $table->unsignedBigInteger('model_type')->after('porcentajedescuento')->comment('Tabla Padre de donde se genera el detallela factura');
                $table->unsignedBigInteger('model_type_id')->after('porcentajedescuento')->comment('Referencia de la Tabla Padre');
            }
        });
        
        Schema::dropIfExists('movimientosproductos');
        Schema::create('movimientosproductos', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['entrada', 'salida', 'ajuste', 'venta']);
            $table->integer('cantidad');
            $table->integer('stock_resultante'); // Stock que quedó después del movimiento
            $table->string('motivo')->nullable(); // Ej: "Compra a proveedor", "Producto roto"

            $table->unsignedBigInteger('producto_id');
            $table->foreign('producto_id')->references('id')
                                        ->on('productos')
                                        ->onDelete('cascade')
                                        ->onUpdate('cascade');

            $table->timestamp('created_at', $precision = 0)->nullable();
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
        Schema::dropIfExists('movimientosproductos');
    }
};
