<?php

use App\Http\Controllers\LogController;
use Illuminate\Support\Facades\Route;

Route::middleware('jwt')->group(function () {
    Route::post('/logs', [LogController::class, 'store']);
    Route::get('/logs', [LogController::class, 'index']);
});

Route::middleware('service.key')->post('/internal/logs', [LogController::class, 'storeInternal']);
