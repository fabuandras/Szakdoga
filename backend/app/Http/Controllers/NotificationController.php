<?php

namespace App\Http\Controllers;

class NotificationController extends Controller
{
    // List notifications (most recent first), limited to 3 months
    public function index()
    {
        return response()->json([]);
    }

    public function markRead($id)
    {
        return response()->json(null, 204);
    }

    public function unreadCount()
    {
        return response()->json(['count' => 0]);
    }
}
