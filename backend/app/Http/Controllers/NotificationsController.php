<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class NotificationsController extends Controller
{
    // List recent notifications
    public function index(Request $request)
    {
        $logs = Notification::query()
            ->with(['item', 'inventory'])
            ->orderByDesc('created_at')
            ->limit(500)
            ->get();

        $logs->transform(function ($log) {
            if (! empty($log->user_name) || empty($log->user_id)) {
                return $log;
            }

            $user = User::where('vKod', $log->user_id)->first();
            if (! $user) {
                return $log;
            }

            $resolvedName = null;
            if (! empty($user->name)) {
                $resolvedName = (string) $user->name;
            } elseif (! empty($user->felhasznalonev)) {
                $resolvedName = (string) $user->felhasznalonev;
            } else {
                $fullName = trim(($user->vez_nev ?? '').' '.($user->ker_nev ?? ''));
                if ($fullName !== '') {
                    $resolvedName = $fullName;
                } elseif (! empty($user->username)) {
                    $resolvedName = (string) $user->username;
                } elseif (! empty($user->email)) {
                    $resolvedName = (string) $user->email;
                }
            }

            if ($resolvedName) {
                $log->user_name = $resolvedName;
            }

            if (empty($log->item_name) && ! empty($log->item?->elnevezes)) {
                $log->item_name = (string) $log->item->elnevezes;
            }

            if (! empty($log->inventory?->code)) {
                $log->setAttribute('inventory_code', $log->inventory->code);
            }

            return $log;
        });

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
        $data = $request->only(['type','message','item_id','inventory_id','item_name','quantity','user_id','user_name','reason','note','data']);
        $notif = Notification::create($data);
        return response()->json($notif, 201);
    }

    // Update notification
    public function update(Request $request, $id)
    {
        $n = Notification::find($id);
        if (! $n) return response()->json(['message' => 'Not found'], 404);
        $n->fill($request->only(['type','message','item_id','inventory_id','item_name','quantity','note','reason','read_at','data']));
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
