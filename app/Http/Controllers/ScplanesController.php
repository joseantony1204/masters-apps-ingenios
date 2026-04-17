<?php

namespace App\Http\Controllers;

use App\Models\{Cfmaestras};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};

class ScplanesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:scplanes.index')->only(['index', 'show']);
        $this->middleware('permission:scplanes.create')->only(['create', 'store']);
        $this->middleware('permission:scplanes.edit')->only(['edit', 'update']);
        $this->middleware('permission:scplanes.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $scplanes = Cfmaestras::where('padre','=',Cfmaestras::select('id')->where('codigo','=',strtoupper('LIS_PLANES'))->first()->id)->whereNotIn('nombre',['FREE'])->whereNull('deleted_at')->get();

        return Inertia::render('scplanes/index', [
            'planes' => $scplanes
        ]);

    }
}