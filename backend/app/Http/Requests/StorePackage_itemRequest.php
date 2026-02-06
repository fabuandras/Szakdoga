<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePackage_itemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'csKod' => ['required', 'string', 'size:4', 'exists:packages,csKod'],
            'rendeles_szam' => ['required', 'integer', 'exists:orders,rendeles_szam'],
            'cikk_szam' => ['required', 'integer', 'exists:items,cikk_szam'],
            'menny' => ['required', 'integer', 'min:1'],
        ];
    }
}