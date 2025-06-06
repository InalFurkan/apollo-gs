<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            Log::info('Login attempt', ['email' => $request->email]);

            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            $user = User::where('email', $credentials['email'])->first();
            
            if (!$user) {
                Log::warning('User not found', ['email' => $credentials['email']]);
                return response()->json(['message' => 'User not found'], 404);
            }

            Log::info('User found', ['user_id' => $user->id]);

            if (
                $credentials['password'] !== $user->password
            ) {
                Log::warning('Invalid password', ['email' => $credentials['email']]);
                return response()->json(['message' => 'Invalid password'], 401);
            }

            Log::info('Password verified', ['user_id' => $user->id]);

            $token = $user->createToken('api-token')->plainTextToken;

            Log::info('Token created', ['user_id' => $user->id]);

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
