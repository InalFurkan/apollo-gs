<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Tag::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);
        $tag = Tag::create($validated);
        return response()->json($tag, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $id,
        ]);
        $tag->update($validated);
        return response()->json($tag);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();
        return response()->json(null, 204);
    }
}
