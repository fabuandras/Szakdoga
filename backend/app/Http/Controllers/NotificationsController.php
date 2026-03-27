<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class NotificationsController extends Controller
{
    // List recent notifications
    public function index(Request $request)
    {
        $logs = Notification::orderByDesc('created_at')->limit(500)->get();
        return response()->json($logs);
    }

    // Show a single notification
    public function show($id)
    {
        $n = Notification::find($id);
        if (! $n) return response()->json(['message' => 'Not found'], 404);
        return response()->json($n);
    }

    // Create a new notification (used by backend events)
    public function store(Request $request)
    {
        $data = $request->only(['type','message','item_id','item_name','quantity','user_id','user_name','reason','note','data']);
        $notif = Notification::create($data);
        return response()->json($notif, 201);
    }

    // Update notification
    public function update(Request $request, $id)
    {
        $n = Notification::find($id);
        if (! $n) return response()->json(['message' => 'Not found'], 404);
        $n->fill($request->only(['type','message','note','reason','read_at','data']));
        $n->save();
        return response()->json($n);
    }

    // Mark as read
    public function markRead($id)
    {
        $n = Notification::find($id);
        if (! $n) return response()->json(['message' => 'Not found'], 404);
        $n->read_at = Carbon::now();
        $n->save();
        return response()->json($n);
    }

    // Delete notification
    public function destroy($id)
    {
        $n = Notification::find($id);
        if (! $n) return response()->json(['message' => 'Not found'], 404);
        $n->delete();
        return response()->json(null, 204);
    }
}
