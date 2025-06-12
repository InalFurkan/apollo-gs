<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Search users by email (for assignment)
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $users = User::where('email', 'like', "%$query%")
            ->select('id', 'name', 'email')
            ->limit(10)
            ->get();
        return response()->json($users);
    }
}
