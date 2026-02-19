<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Models\Order;
use App\Models\Item;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Order::class);
        return response()->json(Order::with('items')->where('user_id', $request->user()->id)->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        Gate::authorize('create', Order::class);

        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'nullable|string',
        ]);

        $order = new Order();
        $order->user_id = $request->user()->id;
        $order->shipping_address = $data['shipping_address'] ?? null;
        $order->total = 0;
        $order->status = 'pending';
        $order->save();

        $total = 0;
        foreach ($data['items'] as $it) {
            $item = Item::findOrFail($it['id']);
            $qty = $it['quantity'];
            $order->items()->attach($item->id, ['quantity' => $qty, 'price' => $item->price]);
            $total += $item->price * $qty;

            if ($item->stock !== null) {
                $item->stock = max(0, $item->stock - $qty);
                $item->save();
            }
        }

        $order->total = $total;
        $order->save();

        return response()->json($order->load('items'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $order = Order::with('items')->findOrFail($id);
        Gate::authorize('view', $order);
        return response()->json($order);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
