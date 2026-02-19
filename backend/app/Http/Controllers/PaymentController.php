<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Models\Order;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StorePaymentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }

    public function process(Request $request)
    {
        Gate::authorize('create', Order::class);

        $data = $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'method' => 'required|string',
        ]);

        $order = Order::findOrFail($data['order_id']);

        // ensure the authenticated user owns the order or has permission
        Gate::authorize('pay', $order);

        // Placeholder: integrate payment gateway here
        $order->status = 'paid';
        $order->paid_at = now();
        $order->payment_method = $data['method'];
        $order->save();

        return response()->json(['status' => 'paid', 'order' => $order]);
    }
}
