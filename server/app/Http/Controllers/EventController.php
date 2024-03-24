<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return Event::all();
    }

    public function store(Request $request)
    {
        $event = Event::create($request->all());
        return response()->json($event, 201);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate(([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'required|date',
            'allDay' => 'required|boolean',
        ]));

        $event->update($validated);

        return response()->json($event);
    }
}
