<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Yeni kullanıcı bilgileri
$email = 'newuser@example.com';
$username = 'newuser';
$password = 'secret123';

// Kullanıcı oluşturma
$user = new User();
$user->email = $email;
$user->name = $username; // veya $user->username = $username; modeldeki alan adınıza göre değiştirin
$user->password = Hash::make($password);
$user->save();

echo "User created with ID: " . $user->id;