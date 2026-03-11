<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json(Item::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'elnevezes' => ['required', 'string', 'max:50'],
            'akt_keszlet' => ['required', 'integer', 'min:0'],
            'egyseg_ar' => ['required', 'numeric', 'min:0'],
            'kep_url' => ['nullable', 'string', 'max:255'],
            'kartya_hatterszin' => ['nullable', 'string', 'max:20'],
            'kartya_stilus' => ['nullable', 'string', 'max:50'],
        ]);

        $item = Item::create($data);

        return response()->json($item, 201);
    }

    public function show($id)
    {
        $item = Item::findOrFail($id);

        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        $data = $request->validate([
            'elnevezes' => ['sometimes', 'required', 'string', 'max:50'],
            'akt_keszlet' => ['sometimes', 'required', 'integer', 'min:0'],
            'egyseg_ar' => ['sometimes', 'required', 'numeric', 'min:0'],
            'kep_url' => ['nullable', 'string', 'max:255'],
            'kartya_hatterszin' => ['nullable', 'string', 'max:20'],
            'kartya_stilus' => ['nullable', 'string', 'max:50'],
        ]);

        $item->update($data);

        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);

        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function publicProducts()
    {
        $selectColumns = ['cikk_szam', 'elnevezes', 'egyseg_ar'];

        if (Schema::hasColumn('items', 'kep_url')) {
            $selectColumns[] = 'kep_url';
        }
        if (Schema::hasColumn('items', 'kartya_hatterszin')) {
            $selectColumns[] = 'kartya_hatterszin';
        }
        if (Schema::hasColumn('items', 'kartya_stilus')) {
            $selectColumns[] = 'kartya_stilus';
        }

        $products = Item::query()
            ->select($selectColumns)
            ->orderBy('cikk_szam')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => (int) $item->cikk_szam,
                    'name' => $item->elnevezes,
                    'price' => (float) $item->egyseg_ar,
                    'image' => $item->kep_url,
                    'cardBackground' => $item->kartya_hatterszin,
                    'cardStyle' => $item->kartya_stilus,
                ];
            });

        return response()->json($products);
    }
}
