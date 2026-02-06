<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'fiz_mod',
        'kuponkod',
        'fizID',
    ];

    protected $casts = [
        'fizID' => 'integer',
    ];

    // 🔗 KAPCSOLAT
    public function cardDetail()
    {
        return $this->hasOne(Card_detail::class, 'kartyaID', 'fizID');
    }
}
