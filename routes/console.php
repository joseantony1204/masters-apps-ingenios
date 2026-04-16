<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command('coupons:birthday')->dailyAt('09:45')->timezone('America/Bogota');
Schedule::command('check:subscriptions')->dailyAt('06:00')->timezone('America/Bogota');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
