<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TagController;

Route::post('/login', [AuthController::class, 'login']); // Login middleware dışında

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('tags', TagController::class);
});
