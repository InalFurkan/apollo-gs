<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    //Bringing the tasks of the authenticated user
    public function index()
    {
        $tasks = Auth::user()->tasks()->orderBy('created_at', 'desc')->get();
        return response()->json($tasks);
    }

    //Creating a new task
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated(); // Validation is handled by the StoreTaskRequest we created

        $task = Auth::user()->tasks()->create([
            'title' => $validated['title'],
            'status' => false,
        ]);

        return response()->json($task, 201);
    }

    //Updating a task
    public function update(UpdateTaskRequest $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validated(); // Validation is handled by the UpdateTaskRequest we created

        $task->update($validated);
        return response()->json($task);
    }

    //Deleting a task
    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(null, 204);
    }
}
