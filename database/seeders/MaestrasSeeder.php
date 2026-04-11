<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MaestrasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataMaestra = [
            [ 'id' => 1, 'codigo' => 'LIS_TIPOTABLAS', 'nombre' => 'TIPOS DE TABLAS', 'padre' => NULL, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 2, 'codigo' => 'LIS_MODULOS', 'nombre' => 'MODULOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 3, 'codigo' => 'LIS_ROLES', 'nombre' => 'ROLES', 'padre' => 1, 'jerarquia' => 2, 'observacion' => NULL],
            [ 'id' => 4, 'codigo' => 'LIS_VISTAS', 'nombre' => 'VISTAS', 'padre' => 1, 'jerarquia' => 3, 'observacion' => NULL],
            [ 'id' => 5, 'codigo' => 'LIS_PERFILES', 'nombre' => 'PERFILES', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 6, 'codigo' => NULL, 'nombre' => 'SEGURIDAD', 'padre' => 2, 'jerarquia' => NULL, 'observacion' => 'ti-lock'],
            
            [ 'id' => 7, 'codigo' => NULL, 'nombre' => 'ADMINISTRADOR', 'padre' => 5, 'jerarquia' => NULL, 'observacion' => NULL],
            
            [ 'id' => 8, 'codigo' => 'LIS_TIPOSIDENTIFICACIONES', 'nombre' => 'TIPOS DE IDENTIFICACIONES', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 9, 'codigo' => 'TI', 'nombre' => 'TAJETA DE IDENTIDAD', 'padre' => 8, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 10, 'codigo' => 'CC', 'nombre' => 'CEDULA DE CIUDADANIA', 'padre' => 8, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 11, 'codigo' => 'NI', 'nombre' => 'NIT', 'padre' => 8, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 12, 'codigo' => 'MS', 'nombre' => 'MENOR SIN IDENTIFICACION', 'padre' => 8, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 13, 'codigo' => 'AS', 'nombre' => 'ADULTO SIN IDENTIFICACION', 'padre' => 8, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 14, 'codigo' => 'CE', 'nombre' => 'CEDULA DE EXTRANJERIA', 'padre' => 8, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 15, 'codigo' => 'RC', 'nombre' => 'REGISTRO CIVIL', 'padre' => 8, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 45, 'codigo' => 'LIS_SEXOS', 'nombre' => 'SEXOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 46, 'codigo' => 'M', 'nombre' => 'MASCULINO', 'padre' => 45, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 47, 'codigo' => 'F', 'nombre' => 'FEMENINO', 'padre' => 45, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 48, 'codigo' => 'ND', 'nombre' => 'NO DEFINIDO', 'padre' => 45, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 49, 'codigo' => 'LIS_ESTADOSCIVILES', 'nombre' => 'ESTADOS CIVILES', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 50, 'codigo' => NULL, 'nombre' => 'SOLTERO', 'padre' => 49, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 51, 'codigo' => NULL, 'nombre' => 'CASADO', 'padre' => 49, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 52, 'codigo' => NULL, 'nombre' => 'UNION LIBRE', 'padre' => 49, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 53, 'codigo' => NULL, 'nombre' => 'DIVORCIADO', 'padre' => 49, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 54, 'codigo' => NULL, 'nombre' => 'VIUDO', 'padre' => 49, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 65, 'codigo' => 'LIS_ESTRATOS', 'nombre' => 'ESTRATOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 66, 'codigo' => '1', 'nombre' => 'UNO', 'padre' => 65, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 67, 'codigo' => '2', 'nombre' => 'DOS', 'padre' => 65, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 68, 'codigo' => '3', 'nombre' => 'TRES', 'padre' => 65, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 69, 'codigo' => '4', 'nombre' => 'CUATRO', 'padre' => 65, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 70, 'codigo' => '5', 'nombre' => 'CINCO', 'padre' => 65, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 71, 'codigo' => 'LIS_TIPOSANGRE', 'nombre' => 'TIPOS DE SANGRE', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 72, 'codigo' => NULL, 'nombre' => 'A', 'padre' => 71, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 73, 'codigo' => NULL, 'nombre' => 'B', 'padre' => 71, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 74, 'codigo' => NULL, 'nombre' => 'O', 'padre' => 71, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 75, 'codigo' => NULL, 'nombre' => 'AB', 'padre' => 71, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 76, 'codigo' => 'LIS_RH', 'nombre' => 'RH', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 77, 'codigo' => 'POSITIVO', 'nombre' => '+', 'padre' => 76, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 78, 'codigo' => 'NEGATIVO', 'nombre' => '-', 'padre' => 76, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 806, 'codigo' => 'LIS_PAISES', 'nombre' => 'PAISES', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 807, 'codigo' => 'CO', 'nombre' => 'COLOMBIA', 'padre' => 806, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 808, 'codigo' => 'VE', 'nombre' => 'VENEZUELA', 'padre' => 806, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 809, 'codigo' => 'LIS_DEPARTAMENTOS', 'nombre' => 'DEPARTAMENTOS', 'padre' => 1, 'jerarquia' => 806, 'observacion' => NULL],
            [ 'id' => 810, 'codigo' => 'GUA', 'nombre' => 'LA GUAJIRA', 'padre' => 809, 'jerarquia' => 807, 'observacion' => NULL],
            [ 'id' => 811, 'codigo' => 'ATL', 'nombre' => 'ATLÁNTICO', 'padre' => 809, 'jerarquia' => 807, 'observacion' => NULL],
            [ 'id' => 812, 'codigo' => 'BOL', 'nombre' => 'BOLÍVAR', 'padre' => 809, 'jerarquia' => 807, 'observacion' => NULL],
            [ 'id' => 813, 'codigo' => 'COR', 'nombre' => 'CÓRDOBA', 'padre' => 809, 'jerarquia' => 807, 'observacion' => NULL],
            [ 'id' => 814, 'codigo' => 'MAG', 'nombre' => 'MAGDALENA', 'padre' => 809, 'jerarquia' => 807, 'observacion' => NULL],
            [ 'id' => 815, 'codigo' => 'CES', 'nombre' => 'CESAR', 'padre' => 809, 'jerarquia' => 807, 'observacion' => NULL],
            [ 'id' => 816, 'codigo' => 'SUC', 'nombre' => 'SUCRE', 'padre' => 809, 'jerarquia' => 807, 'observacion' => NULL],
            [ 'id' => 817, 'codigo' => 'LIS_MUNICIPIOS', 'nombre' => 'MUNICIPIOS', 'padre' => 1, 'jerarquia' => 809, 'observacion' => NULL],
            [ 'id' => 818, 'codigo' => NULL, 'nombre' => 'RIOHACHA', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 819, 'codigo' => NULL, 'nombre' => 'URUMITA', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 820, 'codigo' => NULL, 'nombre' => 'VILLANUEVA', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 821, 'codigo' => NULL, 'nombre' => 'URIBIA', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 822, 'codigo' => NULL, 'nombre' => 'SAN JUAN DEL CESAR', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 823, 'codigo' => NULL, 'nombre' => 'MAICAO', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 824, 'codigo' => NULL, 'nombre' => 'LA JAGUA DEL PILAR', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 825, 'codigo' => NULL, 'nombre' => 'HATONUEVO', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 826, 'codigo' => NULL, 'nombre' => 'DIBULLA', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 827, 'codigo' => NULL, 'nombre' => 'DISTRACCION', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 828, 'codigo' => NULL, 'nombre' => 'EL MOLINO', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 829, 'codigo' => NULL, 'nombre' => 'BARRANCAS', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 830, 'codigo' => NULL, 'nombre' => 'ALBANIA', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 831, 'codigo' => NULL, 'nombre' => 'MANAURE', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 832, 'codigo' => NULL, 'nombre' => 'MAICAO', 'padre' => 817, 'jerarquia' => 810, 'observacion' => NULL],
            [ 'id' => 833, 'codigo' => NULL, 'nombre' => 'MONTERÍA', 'padre' => 817, 'jerarquia' => 816, 'observacion' => NULL],
            [ 'id' => 834, 'codigo' => NULL, 'nombre' => 'VALLEDUPAR', 'padre' => 817, 'jerarquia' => 815, 'observacion' => NULL],
            [ 'id' => 835, 'codigo' => NULL, 'nombre' => 'FONSECA', 'padre' => 817, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 849, 'codigo' => 'LIS_ESTADOS', 'nombre' => 'ESTADOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 850, 'codigo' => NULL, 'nombre' => 'ACTIVO', 'padre' => 849, 'jerarquia' => NULL, 'observacion' => 'success'],
            [ 'id' => 851, 'codigo' => NULL, 'nombre' => 'SUSPENDIDO', 'padre' => 849, 'jerarquia' => NULL, 'observacion' => 'warning'],
            [ 'id' => 852, 'codigo' => NULL, 'nombre' => 'RETIRADO', 'padre' => 849, 'jerarquia' => NULL, 'observacion' => 'danger'],

            [ 'id' => 853, 'codigo' => 'LIS_TIPOSPRODUCTOS', 'nombre' => 'TIPOS PRODUCTOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 854, 'codigo' => NULL, 'nombre' => 'PRODUCTO', 'padre' => 853, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 855, 'codigo' => NULL, 'nombre' => 'SERVICIO', 'padre' => 853, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 856, 'codigo' => NULL, 'nombre' => 'COMBO', 'padre' => 853, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 857, 'codigo' => 'LIS_ESTADOSPRODUCTOS', 'nombre' => 'ESTADOS PRODUCTOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 858, 'codigo' => NULL, 'nombre' => 'ACTIVO', 'padre' => 857, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 859, 'codigo' => NULL, 'nombre' => 'INACTIVO', 'padre' => 857, 'jerarquia' => NULL, 'observacion' => NULL],
            
            [ 'id' => 860, 'codigo' => 'LIS_UNIDADES', 'nombre' => 'UNIDADES', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 861, 'codigo' => NULL, 'nombre' => 'No aplica', 'padre' => 860, 'jerarquia' => NULL, 'observacion' => 'No aplica'],

            [ 'id' => 862, 'codigo' => NULL, 'nombre' => 'Unidades', 'padre' => 860, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 863, 'codigo' => NULL, 'nombre' => 'Unidad', 'padre' => 860, 'jerarquia' => 862, 'observacion' => NULL],
            [ 'id' => 864, 'codigo' => NULL, 'nombre' => 'Servicio', 'padre' => 860, 'jerarquia' => 862, 'observacion' => NULL],
            [ 'id' => 865, 'codigo' => NULL, 'nombre' => 'Pieza', 'padre' => 860, 'jerarquia' => 862, 'observacion' => NULL],
            [ 'id' => 866, 'codigo' => NULL, 'nombre' => 'Millar', 'padre' => 860, 'jerarquia' => 862, 'observacion' => NULL],

            [ 'id' => 867, 'codigo' => NULL, 'nombre' => 'Longitudes', 'padre' => 860, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 868, 'codigo' => NULL, 'nombre' => 'Centímetro (cm)', 'padre' => 860, 'jerarquia' => 867, 'observacion' => NULL],
            [ 'id' => 869, 'codigo' => NULL, 'nombre' => 'Metro (m)', 'padre' => 860, 'jerarquia' => 867, 'observacion' => NULL],
            [ 'id' => 870, 'codigo' => NULL, 'nombre' => 'Pulgada', 'padre' => 860, 'jerarquia' => 867, 'observacion' => NULL],

            [ 'id' => 871, 'codigo' => NULL, 'nombre' => 'Áreas', 'padre' => 860, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 872, 'codigo' => NULL, 'nombre' => 'Centímetro cuadrado (cm2)', 'padre' => 860, 'jerarquia' => 871, 'observacion' => NULL],
            [ 'id' => 873, 'codigo' => NULL, 'nombre' => 'Metro cuadrado (m2)', 'padre' => 860, 'jerarquia' => 871, 'observacion' => NULL],
            [ 'id' => 874, 'codigo' => NULL, 'nombre' => 'Pulgada cuadrada', 'padre' => 860, 'jerarquia' => 871, 'observacion' => NULL],

            [ 'id' => 875, 'codigo' => NULL, 'nombre' => 'Volumenes', 'padre' => 860, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 876, 'codigo' => NULL, 'nombre' => 'Mililitro (mL)', 'padre' => 860, 'jerarquia' => 875, 'observacion' => 1000],
            [ 'id' => 877, 'codigo' => NULL, 'nombre' => 'Litro (L)', 'padre' => 860, 'jerarquia' => 875, 'observacion' => 0],
            [ 'id' => 878, 'codigo' => NULL, 'nombre' => 'Galón', 'padre' => 860, 'jerarquia' => 875, 'observacion' => 1],

            [ 'id' => 879, 'codigo' => NULL, 'nombre' => 'Pesos', 'padre' => 860, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 880, 'codigo' => NULL, 'nombre' => 'Gramo (g)', 'padre' => 860, 'jerarquia' => 879, 'observacion' => 1000],
            [ 'id' => 881, 'codigo' => NULL, 'nombre' => 'Kilogramo (Kg)', 'padre' => 860, 'jerarquia' => 879, 'observacion' => 1],
            [ 'id' => 882, 'codigo' => NULL, 'nombre' => 'Tonelada', 'padre' => 860, 'jerarquia' => 879, 'observacion' => 0],
            [ 'id' => 883, 'codigo' => NULL, 'nombre' => 'Libra', 'padre' => 860, 'jerarquia' => 879, 'observacion' => 500],

            [ 'id' => 884, 'codigo' => 'LIS_TIPOSIMPUESTOS', 'nombre' => 'TIPOS IMPUESTOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 885, 'codigo' => NULL, 'nombre' => 'Impuesto Valor Agregado (IVA)', 'padre' => 884, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 886, 'codigo' => NULL, 'nombre' => 'Retencion', 'padre' => 884, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 887, 'codigo' => NULL, 'nombre' => 'Impuesto de Industria y Comercio (ICA)', 'padre' => 884, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 888, 'codigo' => NULL, 'nombre' => 'Excluido', 'padre' => 884, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 889, 'codigo' => 'LIS_CATEGORIASPRODUCTOS', 'nombre' => 'CATEGORIAS DE PRODUCTOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 890, 'codigo' => NULL, 'nombre' => 'Cortes', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => 'ti ti-cut'],
            [ 'id' => 891, 'codigo' => NULL, 'nombre' => 'Pestañas', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => 'Barba'],
            [ 'id' => 892, 'codigo' => NULL, 'nombre' => 'Color cabello', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => 'ti ti-palette'],
            [ 'id' => 893, 'codigo' => NULL, 'nombre' => 'Uñas', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => 'ti ti-hand-finger'],
            [ 'id' => 894, 'codigo' => NULL, 'nombre' => 'Depilacion facial', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => 'ti ti-scissors'],
            
            [ 'id' => 895, 'codigo' => 'LIS_DIASSEMANA', 'nombre' => 'DIAS DE LA SEMANA', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 896, 'codigo' => NULL, 'nombre' => 'LUNES', 'padre' => 895, 'jerarquia' => NULL, 'observacion' => 'LUN'],
            [ 'id' => 897, 'codigo' => NULL, 'nombre' => 'MARTES', 'padre' => 895, 'jerarquia' => NULL, 'observacion' => 'MAR'],
            [ 'id' => 898, 'codigo' => NULL, 'nombre' => 'MIERCOLES', 'padre' => 895, 'jerarquia' => NULL, 'observacion' => 'MIE'],
            [ 'id' => 899, 'codigo' => NULL, 'nombre' => 'JUEVES', 'padre' => 895, 'jerarquia' => NULL, 'observacion' => 'JUE'],
            [ 'id' => 900, 'codigo' => NULL, 'nombre' => 'VIERNES', 'padre' => 895, 'jerarquia' => NULL, 'observacion' => 'VIE'],
            [ 'id' => 901, 'codigo' => NULL, 'nombre' => 'SABADO', 'padre' => 895, 'jerarquia' => NULL, 'observacion' => 'SAB'],
            [ 'id' => 902, 'codigo' => NULL, 'nombre' => 'DOMINGO', 'padre' => 895, 'jerarquia' => NULL, 'observacion' => 'DOM'],

            [ 'id' => 903, 'codigo' => 'LIS_MOTIVOSBLOQEOSAGENDA', 'nombre' => 'MOTIVOS BLOQUEOS AGENDA', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 904, 'codigo' => NULL, 'nombre' => 'PERSIMO', 'padre' => 903, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 905, 'codigo' => NULL, 'nombre' => 'DIA LIBRE', 'padre' => 903, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 906, 'codigo' => NULL, 'nombre' => 'CALAMIDAD', 'padre' => 903, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 907, 'codigo' => NULL, 'nombre' => 'OTRO', 'padre' => 903, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 908, 'codigo' => 'LIS_OCUPACIONES', 'nombre' => 'OCUPACIONES', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 909, 'codigo' => NULL, 'nombre' => 'Directores y Gerentes: Directores generales, gerentes de producción, gerentes financieros.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
           
            [ 'id' => 910, 'codigo' => NULL, 'nombre' => 'EMPLEADO', 'padre' => 5, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 911, 'codigo' => NULL, 'nombre' => 'CLIENTE', 'padre' => 5, 'jerarquia' => NULL, 'observacion' => NULL],
            
            [ 'id' => 912, 'codigo' => 'LIS_ESTADOSCITAS', 'nombre' => 'ESTADOS DE CITAS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 913, 'codigo' => 'AC', 'nombre' => 'Activa', 'padre' => 912, 'jerarquia' => NULL, 'observacion' => 'info'],
            [ 'id' => 914, 'codigo' => 'FA', 'nombre' => 'Facturada', 'padre' => 912, 'jerarquia' => NULL, 'observacion' => 'primary'],
            [ 'id' => 915, 'codigo' => 'AS', 'nombre' => 'Asistida', 'padre' => 912, 'jerarquia' => NULL, 'observacion' => 'success'],
            [ 'id' => 916, 'codigo' => 'CA', 'nombre' => 'Cancelada', 'padre' => 912, 'jerarquia' => NULL, 'observacion' => 'danger'],
            [ 'id' => 917, 'codigo' => 'RE', 'nombre' => 'Reprogramada', 'padre' => 912, 'jerarquia' => NULL, 'observacion' => 'warning'],

            [ 'id' => 918, 'codigo' => 'LIS_MODEL_TYPES', 'nombre' => 'TABLAS TIPO', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 919, 'codigo' => 'cfempleadosservicios', 'nombre' => 'Tabla personalizacion empleados con servicios', 'padre' => 918, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 920, 'codigo' => 'productos', 'nombre' => 'Tabla con productos', 'padre' => 918, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 921, 'codigo' => 'adcitas', 'nombre' => 'Tabla citas', 'padre' => 918, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 922, 'codigo' => 'personas', 'nombre' => 'Tabla personas', 'padre' => 918, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 923, 'codigo' => 'LIS_ESTADOSTURNOS', 'nombre' => 'ESTADOS DE TURNOS', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 924, 'codigo' => 'AC', 'nombre' => 'Activo', 'padre' => 923, 'jerarquia' => NULL, 'observacion' => 'success'],
            [ 'id' => 925, 'codigo' => 'BO', 'nombre' => 'Bloqueado', 'padre' => 923, 'jerarquia' => NULL, 'observacion' => 'warning'],
            [ 'id' => 926, 'codigo' => 'SU', 'nombre' => 'Suspendido', 'padre' => 923, 'jerarquia' => NULL, 'observacion' => 'warning'],
            [ 'id' => 927, 'codigo' => 'CE', 'nombre' => 'Cerrado', 'padre' => 923, 'jerarquia' => NULL, 'observacion' => 'danger'],

            [ 'id' => 928, 'codigo' => 'LIS_METODOSPAGO', 'nombre' => 'METODOS DE PAGO', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 929, 'codigo' => 'EF', 'nombre' => 'Efectivo', 'padre' => 928, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 930, 'codigo' => 'TD', 'nombre' => 'Tarjetas débito', 'padre' => 928, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 931, 'codigo' => 'TC', 'nombre' => 'Tarjetas crédito', 'padre' => 928, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 932, 'codigo' => 'PM', 'nombre' => 'Pagos móviles (e-wallets, pagos entre particulares, pagos con código QR)', 'padre' => 928, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 933, 'codigo' => 'TB', 'nombre' => 'Transferencias bancarias', 'padre' => 928, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 934, 'codigo' => 'EN', 'nombre' => 'Enlaces de pago', 'padre' => 928, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 935, 'codigo' => 'CR', 'nombre' => 'Compra ahora, paga después (pagos a plazos)', 'padre' => 928, 'jerarquia' => NULL, 'observacion' => NULL],
            
            [ 'id' => 936, 'codigo' => 'LIS_ESTADOSFACTURAS', 'nombre' => 'ESTADOS DE FACTURA', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 937, 'codigo' => NULL, 'nombre' => 'Abierta', 'padre' => 936, 'jerarquia' => NULL, 'observacion' => 'info'],
            [ 'id' => 938, 'codigo' => NULL, 'nombre' => 'Pagada', 'padre' => 936, 'jerarquia' => NULL, 'observacion' => 'success'],
            [ 'id' => 939, 'codigo' => NULL, 'nombre' => 'Anulada', 'padre' => 936, 'jerarquia' => NULL, 'observacion' => 'danger'],
            [ 'id' => 940, 'codigo' => NULL, 'nombre' => 'Credito', 'padre' => 936, 'jerarquia' => NULL, 'observacion' => 'primary'],

            [ 'id' => 941, 'codigo' => 'LIS_TIPOSFACTURAS', 'nombre' => 'TIPOS DE FACTURA', 'padre' => 1, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 942, 'codigo' => NULL, 'nombre' => 'Compra', 'padre' => 941, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 943, 'codigo' => NULL, 'nombre' => 'Venta', 'padre' => 941, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 944, 'codigo' => NULL, 'nombre' => 'Cotizacion', 'padre' => 941, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 945, 'codigo' => NULL, 'nombre' => 'Depilacion corporal', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => 'ti ti-scissors'],
            [ 'id' => 946, 'codigo' => NULL, 'nombre' => 'Peinados', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 947, 'codigo' => NULL, 'nombre' => 'Maquillaje', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 948, 'codigo' => NULL, 'nombre' => 'Cejas', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 949, 'codigo' => NULL, 'nombre' => 'Limpieza facial', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 950, 'codigo' => NULL, 'nombre' => 'Tratamientos capilares', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 951, 'codigo' => NULL, 'nombre' => 'Alisados', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 952, 'codigo' => NULL, 'nombre' => 'Masajes', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 953, 'codigo' => NULL, 'nombre' => 'Promoción', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 954, 'codigo' => NULL, 'nombre' => 'Barba', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => 'ti ti-palette'],
            [ 'id' => 955, 'codigo' => NULL, 'nombre' => 'Experiencia y venta', 'padre' => 889, 'jerarquia' => NULL, 'observacion' => NULL],

            [ 'id' => 956, 'codigo' => NULL, 'nombre' => 'Profesionales Científicos e Intelectuales: Médicos, ingenieros, docentes, abogados.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 957, 'codigo' => NULL, 'nombre' => 'Técnicos y Profesionales de Nivel Medio: Técnicos en salud, asistentes de ingeniería, técnicos en finanzas.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 958, 'codigo' => NULL, 'nombre' => 'Personal de Apoyo Administrativo: Oficinistas generales, secretarios, digitadores, cajeros.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 959, 'codigo' => NULL, 'nombre' => 'Servicios y Vendedores: Personal de hostelería, comerciantes, cuidadores, personal de seguridad.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 960, 'codigo' => NULL, 'nombre' => 'Agricultores y Operarios Agropecuarios: Agricultores, trabajadores forestales, pescadores.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 961, 'codigo' => NULL, 'nombre' => 'Oficiales, Operarios y Artesanos: Carpinteros, mecánicos, electricistas, plomeros, pintores.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 962, 'codigo' => NULL, 'nombre' => 'Operadores de Maquinaria y Ensambladores: Operadores de maquinaria industrial, conductores de vehículos.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 963, 'codigo' => NULL, 'nombre' => 'Ocupaciones Elementales: Limpiadores, asistentes de cocina, ayudantes de construcción, vendedores ambulantes.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],
            [ 'id' => 964, 'codigo' => NULL, 'nombre' => 'Fuerzas Militares: Oficiales y suboficiales de las fuerzas armadas.', 'padre' => 908, 'jerarquia' => NULL, 'observacion' => NULL],

            
  
        ];
        foreach (array_chunk($dataMaestra,1000) as $data){
            DB::table('cfmaestras')->insert($data);
        }
    }
}
