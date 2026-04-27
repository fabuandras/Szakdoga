<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ItemSeeder extends Seeder
{
    public function run()
    {
        // Example items to seed
        $items = [
            [
                'elnevezes' => 'Pihe-puha Alpakka Fonal',
                'egyseg_ar' => 3490,
                'akt_keszlet' => 40,
                'kep_url' => 'https://images.unsplash.com/photo-1562158070-5d9b6b78d7d4?auto=format&fit=crop&w=900&q=80', // alpaca yarn
                'kartya_hatterszin' => '#f9efe6',
                'kartya_stilus' => 'meleg',
            ],
            ['elnevezes' => 'Pasztell Pamut Fonal Csomag', 'egyseg_ar' => 4990, 'akt_keszlet' => 55, 'kep_url' => 'https://s13emagst.akamaized.net/products/93648/93647053/images/res_4a54e622987e31a7de8e4b647aee2753.jpg', 'kartya_hatterszin' => '#f3f8ef', 'kartya_stilus' => 'pasztell'],
            ['elnevezes' => 'Ergonomikus Horgolotu 3.5mm', 'egyseg_ar' => 1490, 'akt_keszlet' => 95, 'kep_url' => 'https://www.fonaltar.hu/wp-content/uploads/195175_01.jpg', 'kartya_hatterszin' => '#eef5ff', 'kartya_stilus' => 'minimal'],
            ['elnevezes' => 'Amigurumi Starter Kit', 'egyseg_ar' => 7990, 'akt_keszlet' => 28, 'kep_url' => 'https://www.artmie.hu/fotky1766/fotos/kreativ-horgolo-keszlet-roka-RMSCR1700-GE.jpg', 'kartya_hatterszin' => '#fff6e9', 'kartya_stilus' => 'jatekos'],
            ['elnevezes' => 'Biztonsagi Szem Szett 100db', 'egyseg_ar' => 1990, 'akt_keszlet' => 120, 'kep_url' => 'https://s13emagst.akamaized.net/products/77451/77450884/images/res_2919a157e43da80d6a2852e1c6f95537.jpg', 'kartya_hatterszin' => '#f5f5f5', 'kartya_stilus' => 'neutral'],
            ['elnevezes' => 'Fapelenkas Nyuszi Mintacsomag', 'egyseg_ar' => 2590, 'akt_keszlet' => 50, 'kep_url' => 'https://mucifonal.hu/img/16667/A28B001-09063/500x500,1764251384/A28B001-09063.jpg', 'kartya_hatterszin' => '#fff2f2', 'kartya_stilus' => 'soft'],
            ['elnevezes' => 'Merino Luxus Fonal', 'egyseg_ar' => 4290, 'akt_keszlet' => 36, 'kep_url' => 'https://s13emagst.akamaized.net/products/90918/90917701/images/res_36155d32c5d829f15b7ed6efe75a5cf9.jpg', 'kartya_hatterszin' => '#f4eefc', 'kartya_stilus' => 'lux'],
            ['elnevezes' => 'PomPom Keszito Keszlet', 'egyseg_ar' => 1890, 'akt_keszlet' => 70, 'kep_url' => 'https://www.inimini.hu/img/14296/DJ00049/500x500,r,1772114773/DJ00049.jpg', 'kartya_hatterszin' => '#ecfbff', 'kartya_stilus' => 'fancy'],
            ['elnevezes' => 'Mini Horgolt Virag Csomag', 'egyseg_ar' => 2390, 'akt_keszlet' => 80, 'kep_url' => 'https://www.magyartermekbolt.hu/wp-content/uploads/2024/02/Rozsa3.jpg', 'kartya_hatterszin' => '#fef8ea', 'kartya_stilus' => 'tavasz'],
            ['elnevezes' => 'Bambusz Horgolotu 5mm', 'egyseg_ar' => 1190, 'akt_keszlet' => 110, 'kep_url' => 'https://s13emagst.akamaized.net/products/77763/77762619/images/res_84a6722eff7ff904a643435517b12984.jpg', 'kartya_hatterszin' => '#f1f8f0', 'kartya_stilus' => 'nature'],
            ['elnevezes' => 'Pluss Boci Amigurumi Kit', 'egyseg_ar' => 6890, 'akt_keszlet' => 32, 'kep_url' => 'https://i.pinimg.com/236x/c0/d3/17/c0d317b20914a0ba82c3e8dea4410417.jpg', 'kartya_hatterszin' => '#fff4e6', 'kartya_stilus' => 'jatekos'],
            ['elnevezes' => 'Horgolt Taska Alap Csomag', 'egyseg_ar' => 5590, 'akt_keszlet' => 41, 'kep_url' => 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRpEWzmwoHk_-SoOdGubczlRrL5SYtM55n8vYhGYf5LLq29Ptx8MewlDpo3yOvEZeu53ycrAosmq5TaxQwsXLU88afAdV_wXQfrH0Qm1HZNQoAqasCz6icO2JVBaverwj_qqUL0S-UMbTk&usqp=CAc', 'kartya_hatterszin' => '#f1f3ff', 'kartya_stilus' => 'urban'],
            ['elnevezes' => 'Texturalt Fonal Mix', 'egyseg_ar' => 3790, 'akt_keszlet' => 60, 'kep_url' => 'https://mucifonal.hu/img/16667/YJC8213/500x500,1748269582/YJC8213.jpg', 'kartya_hatterszin' => '#fdf1f7', 'kartya_stilus' => 'texturalt'],
            ['elnevezes' => 'Fonal Tarto Kosar', 'egyseg_ar' => 3290, 'akt_keszlet' => 66, 'kep_url' => 'https://img.joomcdn.net/2164ffe6c9d2a7c5cfbd42b252ae0efcfc11e7f0_original.jpeg', 'kartya_hatterszin' => '#eef8f8', 'kartya_stilus' => 'clean'],
            ['elnevezes' => 'Horgolt Kiegeszito Csomag', 'egyseg_ar' => 2990, 'akt_keszlet' => 77, 'kep_url' => 'https://s13emagst.akamaized.net/products/49793/49792365/images/res_30bb3dc838db8d305fe08f90a0f4c82d.jpg', 'kartya_hatterszin' => '#faf3e8', 'kartya_stilus' => 'retro'],
            ['elnevezes' => 'Neon Fonal Trio', 'egyseg_ar' => 2790, 'akt_keszlet' => 58, 'kep_url' => 'https://mucifonal.hu/img/16667/YJC7201/500x500,1748266786/YJC7201.jpg', 'kartya_hatterszin' => '#f0ffef', 'kartya_stilus' => 'vibralo'],
            ['elnevezes' => 'Horgolt Babatakarony Kit', 'egyseg_ar' => 8990, 'akt_keszlet' => 24, 'kep_url' => 'https://bunnymoonhu.com/wp-content/uploads/2023/06/IMG_6257.jpg', 'kartya_hatterszin' => '#f2f5ff', 'kartya_stilus' => 'premium'],
            ['elnevezes' => 'Kezmelegito Mintacsomag', 'egyseg_ar' => 2190, 'akt_keszlet' => 83, 'kep_url' => 'https://holvettedencsinaltam.hu/wp-content/uploads/2022/10/20221031_130102_1-819x1024.jpg', 'kartya_hatterszin' => '#fff3ef', 'kartya_stilus' => 'teli'],
            ['elnevezes' => 'Fonal Fesukeszlet', 'egyseg_ar' => 1590, 'akt_keszlet' => 105, 'kep_url' => '', 'kartya_hatterszin' => '#f6f9ed', 'kartya_stilus' => 'utility'],
            ['elnevezes' => 'Kezdo Horgolo Ajandekdoboz', 'egyseg_ar' => 9990, 'akt_keszlet' => 18, 'kep_url' => '', 'kartya_hatterszin' => '#fff0f8', 'kartya_stilus' => 'gift'],
        ];

        if (! Schema::hasTable('items')) {
            return;
        }

        $dbName = DB::connection()->getDatabaseName();
        $metaRows = DB::select(
            'SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
            [$dbName, 'items']
        );

        $columns = Schema::getColumnListing('items');

        // detect primary key columns to avoid modifying them (prevents FK constraint errors)
        $pkRows = DB::select('SHOW KEYS FROM items WHERE Key_name = ?', ['PRIMARY']);
        $primaryKeyColumns = [];
        foreach ($pkRows as $pr) {
            $prArr = (array) $pr;
            if (isset($prArr['Column_name'])) {
                $primaryKeyColumns[] = $prArr['Column_name'];
            } elseif (isset($prArr['column_name'])) {
                $primaryKeyColumns[] = $prArr['column_name'];
            } elseif (isset($prArr['COLUMN_NAME'])) {
                $primaryKeyColumns[] = $prArr['COLUMN_NAME'];
            }
        }

        // detect common image column names in the table so seeder maps 'kep_url' correctly
        $imageCandidates = ['kep_url','kepurl','image_url','image','kep','imageurl','kepimg'];
        $availableImageColumn = null;
        foreach ($imageCandidates as $c) {
            if (in_array($c, $columns)) {
                $availableImageColumn = $c;
                break;
            }
        }

        // placeholder image if none provided
        $placeholderImage = 'https://via.placeholder.com/600x400?text=No+image';

        $colsInfo = [];
        foreach ($metaRows as $m) {
            $colsInfo[$m->COLUMN_NAME] = [
                'nullable' => strtoupper($m->IS_NULLABLE) === 'YES',
                'default' => $m->COLUMN_DEFAULT,
                'type' => strtolower($m->DATA_TYPE),
            ];
        }

        foreach ($items as $item) {
            $row = [];

            // Map possible localized keys to actual column names if necessary
            // e.g. keep 'kep_url' as is, map other keys if your schema uses different names
            foreach ($item as $key => $value) {
                // direct column match
                if (in_array($key, $columns)) {
                    $row[$key] = $value;
                    continue;
                }

                // map common incoming image key 'kep_url' (or variants) to the actual DB image column
                if (in_array($key, ['kep_url','kepurl','image_url','image','kep','imageurl']) && $availableImageColumn) {
                    $row[$availableImageColumn] = $value;
                }
            }

            // Ensure timestamps if present on table
            if (in_array('created_at', $columns) && ! isset($row['created_at'])) {
                $row['created_at'] = now();
            }
            if (in_array('updated_at', $columns) && ! isset($row['updated_at'])) {
                $row['updated_at'] = now();
            }

            // if image column exists but value missing or empty, set placeholder
            if ($availableImageColumn && (! array_key_exists($availableImageColumn, $row) || $row[$availableImageColumn] === '')) {
                $row[$availableImageColumn] = $placeholderImage;
            }

            // Fill missing NOT NULL columns with safe defaults
            foreach ($colsInfo as $colName => $info) {
                if (array_key_exists($colName, $row)) {
                    continue;
                }

                // skip primary key columns to avoid updating primary key values
                if (! empty($primaryKeyColumns) && in_array($colName, $primaryKeyColumns)) {
                    continue;
                }

                if (in_array($colName, ['created_at', 'updated_at'])) {
                    continue;
                }

                if (! is_null($info['default'])) {
                    continue; // DB will use default
                }

                if ($info['nullable']) {
                    $row[$colName] = null;
                    continue;
                }

                $type = $info['type'];
                if (in_array($type, ['date','datetime','timestamp','time','year'])) {
                    if ($type === 'date') {
                        $row[$colName] = date('Y-m-d');
                    } elseif ($type === 'time') {
                        $row[$colName] = date('H:i:s');
                    } elseif ($type === 'year') {
                        $row[$colName] = date('Y');
                    } else {
                        $row[$colName] = date('Y-m-d H:i:s');
                    }
                } elseif (in_array($type, ['int','bigint','smallint','mediumint','tinyint','integer'])) {
                    $row[$colName] = 0;
                } elseif (in_array($type, ['decimal','float','double'])) {
                    $row[$colName] = 0;
                } else {
                    $row[$colName] = '';
                }
            }

            if (! empty($row)) {
                // Use updateOrInsert so rerunning the seeder will overwrite existing rows
                // (match by 'elnevezes') — this ensures the correct image URL is applied
                DB::table('items')->updateOrInsert(
                    ['elnevezes' => $row['elnevezes']],
                    $row
                );
            }
        }
    }
}
