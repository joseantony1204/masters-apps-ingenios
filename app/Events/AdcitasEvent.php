<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
// Eliminamos SerializedModels para evitar el error

class AdcitasEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets; // Solo estos dos

    public $cita; 
    public function __construct($cita)
    {
        $this->cita = $cita;
    }

    public function broadcastOn(): array
    {
        return [ new Channel('dashboard-updates') ];
    }

    public function broadcastAs(): string
    {
        return 'actualizar.dashboard';
    }
}