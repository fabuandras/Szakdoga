<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['elnevezes' => 'Pihe-puha Alpakka Fonal', 'egyseg_ar' => 3490, 'akt_keszlet' => 40, 'kep_url' => 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f9efe6', 'kartya_stilus' => 'meleg'],
            ['elnevezes' => 'Pasztell Pamut Fonal Csomag', 'egyseg_ar' => 4990, 'akt_keszlet' => 55, 'kep_url' => 'https://images.unsplash.com/photo-1604881987924-1b6f8f665fb2?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f3f8ef', 'kartya_stilus' => 'pasztell'],
            ['elnevezes' => 'Ergonomikus Horgolotu 3.5mm', 'egyseg_ar' => 1490, 'akt_keszlet' => 95, 'kep_url' => 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#eef5ff', 'kartya_stilus' => 'minimal'],
            ['elnevezes' => 'Amigurumi Starter Kit', 'egyseg_ar' => 7990, 'akt_keszlet' => 28, 'kep_url' => 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#fff6e9', 'kartya_stilus' => 'jatekos'],
            ['elnevezes' => 'Biztonsagi Szem Szett 100db', 'egyseg_ar' => 1990, 'akt_keszlet' => 120, 'kep_url' => 'https://images.unsplash.com/photo-1582719478177-4bb6d6a8f94e?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f5f5f5', 'kartya_stilus' => 'neutral'],
            ['elnevezes' => 'Fapelenkas Nyuszi Mintacsomag', 'egyseg_ar' => 2590, 'akt_keszlet' => 50, 'kep_url' => 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#fff2f2', 'kartya_stilus' => 'soft'],
            ['elnevezes' => 'Merino Luxus Fonal', 'egyseg_ar' => 4290, 'akt_keszlet' => 36, 'kep_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f4eefc', 'kartya_stilus' => 'lux'],
            ['elnevezes' => 'PomPom Keszito Keszlet', 'egyseg_ar' => 1890, 'akt_keszlet' => 70, 'kep_url' => 'https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#ecfbff', 'kartya_stilus' => 'fancy'],
            ['elnevezes' => 'Mini Horgolt Virag Csomag', 'egyseg_ar' => 2390, 'akt_keszlet' => 80, 'kep_url' => 'https://images.unsplash.com/photo-1524635962361-fb9c9f77f0ec?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#fef8ea', 'kartya_stilus' => 'tavasz'],
            ['elnevezes' => 'Bambusz Horgolotu 5mm', 'egyseg_ar' => 1190, 'akt_keszlet' => 110, 'kep_url' => 'https://images.unsplash.com/photo-1470093851219-69951fcbb533?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f1f8f0', 'kartya_stilus' => 'nature'],
            ['elnevezes' => 'Pluss Boci Amigurumi Kit', 'egyseg_ar' => 6890, 'akt_keszlet' => 32, 'kep_url' => 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#fff4e6', 'kartya_stilus' => 'jatekos'],
            ['elnevezes' => 'Horgolt Taska Alap Csomag', 'egyseg_ar' => 5590, 'akt_keszlet' => 41, 'kep_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f1f3ff', 'kartya_stilus' => 'urban'],
            ['elnevezes' => 'Texturalt Fonal Mix', 'egyseg_ar' => 3790, 'akt_keszlet' => 60, 'kep_url' => 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#fdf1f7', 'kartya_stilus' => 'texturalt'],
            ['elnevezes' => 'Fonal Tarto Kosar', 'egyseg_ar' => 3290, 'akt_keszlet' => 66, 'kep_url' => 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#eef8f8', 'kartya_stilus' => 'clean'],
            ['elnevezes' => 'Horgolt Kiegeszito Csomag', 'egyseg_ar' => 2990, 'akt_keszlet' => 77, 'kep_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#faf3e8', 'kartya_stilus' => 'retro'],
            ['elnevezes' => 'Neon Fonal Trio', 'egyseg_ar' => 2790, 'akt_keszlet' => 58, 'kep_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f0ffef', 'kartya_stilus' => 'vibralo'],
            ['elnevezes' => 'Horgolt Babatakarony Kit', 'egyseg_ar' => 8990, 'akt_keszlet' => 24, 'kep_url' => 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f2f5ff', 'kartya_stilus' => 'premium'],
            ['elnevezes' => 'Kezmelegito Mintacsomag', 'egyseg_ar' => 2190, 'akt_keszlet' => 83, 'kep_url' => 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#fff3ef', 'kartya_stilus' => 'teli'],
            ['elnevezes' => 'Fonal Fesukeszlet', 'egyseg_ar' => 1590, 'akt_keszlet' => 105, 'kep_url' => 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#f6f9ed', 'kartya_stilus' => 'utility'],
            ['elnevezes' => 'Kezdo Horgolo Ajandekdoboz', 'egyseg_ar' => 9990, 'akt_keszlet' => 18, 'kep_url' => 'https://images.unsplash.com/photo-1519720842496-c64e5c8f7f0d?auto=format&fit=crop&w=900&q=80', 'kartya_hatterszin' => '#fff0f8', 'kartya_stilus' => 'gift'],
        ];

        foreach ($products as $product) {
            Item::create($product);
        }
    }
}
