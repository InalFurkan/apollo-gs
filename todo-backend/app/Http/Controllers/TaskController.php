<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;
    //Bringing the tasks of the authenticated user
    public function index(Request $request)
    {
        $query = Auth::user()->tasks()->with('tags')->orderBy('created_at', 'desc');
        if ($request->has('search') && trim($request->search) !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%");
            });
        }
        $tasks = $query->get();
        return response()->json($tasks);
    }

    //Creating a new task
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated(); // Validation is handled by the StoreTaskRequest we created

        $task = Auth::user()->tasks()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => false,
        ]);

        if (isset($validated['tags'])) {
            $task->tags()->sync($validated['tags']);
        }
        // Assign users if provided
        if (isset($validated['user_ids'])) {
            $task->assignedUsers()->sync($validated['user_ids']);
        }
        $task->load(['tags', 'assignedUsers']);
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
        if (isset($validated['tags'])) {
            $task->tags()->sync($validated['tags']);
        }
        // Assign users if provided
        if (isset($validated['user_ids'])) {
            $task->assignedUsers()->sync($validated['user_ids']);
        }
        $task->load(['tags', 'assignedUsers']);
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

    // Assign users to a task
    public function assignUsers(Request $request, Task $task)
    {
        $this->authorize('update', $task); // Optional: add policy for security
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);
        $task->assignedUsers()->sync($validated['user_ids']);
        $task->load(['tags', 'assignedUsers']);
        return response()->json($task);
    }
}
