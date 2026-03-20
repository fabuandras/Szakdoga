<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Ensure fresh data: disable foreign key checks, truncate users, then re-enable
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = [
            [
                'felhasznalonev' => 'Bendeguz',
                'vez_nev' => 'Marek',
                'ker_nev' => 'Bendegúz',
                'megszolitas' => 'Dr',
                'tel_szam' => '+36 20 420 6969',
                'szul_datum' => '2000-10-10',
                'email' => 'marekbendeguz@admin.hu',
                'jelszo' => Hash::make('Aa123456@'),
                'kedvencek' => json_encode([]),
                'kosar' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'felhasznalonev' => 'Bori',
                'vez_nev' => 'Ilyés',
                'ker_nev' => 'Borbála',
                'megszolitas' => 'Ms',
                'tel_szam' => '+36 20 789 5634',
                'szul_datum' => '2000-10-10',
                'email' => 'ilyesbori@raktaros.hu',
                'jelszo' => Hash::make('Aa123456@'),
                'kedvencek' => json_encode([]),
                'kosar' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'felhasznalonev' => 'Anna',
                'vez_nev' => 'Kiss',
                'ker_nev' => 'Anna',
                'megszolitas' => 'Ms',
                'tel_szam' => '+36 30 123 4567',
                'szul_datum' => '1998-05-12',
                'email' => 'anna@webshop.hu',
                'jelszo' => Hash::make('Aa123456@'),
                'kedvencek' => json_encode([]),
                'kosar' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Get actual columns present in users table and their metadata
        if (! Schema::hasTable('users')) {
            return;
        }

        $dbName = DB::connection()->getDatabaseName();
        $metaRows = DB::select(
            'SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
            [$dbName, 'users']
        );

        $columns = Schema::getColumnListing('users');

        $colsInfo = [];
        foreach ($metaRows as $m) {
            $colsInfo[$m->COLUMN_NAME] = [
                'nullable' => strtoupper($m->IS_NULLABLE) === 'YES',
                'default' => $m->COLUMN_DEFAULT,
                'type' => strtolower($m->DATA_TYPE),
            ];
        }

        foreach ($users as $user) {
            $row = [];

            // Map common Hungarian keys to standard columns
            if (isset($user['jelszo']) && in_array('password', $columns)) {
                $row['password'] = Hash::make($user['jelszo']);
            }

            if (isset($user['felhasznalonev'])) {
                if (in_array('name', $columns)) {
                    $row['name'] = $user['felhasznalonev'];
                } elseif (in_array('username', $columns)) {
                    $row['username'] = $user['felhasznalonev'];
                } elseif (in_array('felhasznalonev', $columns)) {
                    $row['felhasznalonev'] = $user['felhasznalonev'];
                }
            }

            // Map first/last name
            if ((isset($user['ker_nev']) || isset($user['vez_nev'])) && in_array('name', $columns) && empty($row['name'])) {
                $row['name'] = trim(($user['vez_nev'] ?? '') . ' ' . ($user['ker_nev'] ?? ''));
            }

            // Email
            if (isset($user['email']) && in_array('email', $columns)) {
                $row['email'] = $user['email'];
            }

            // Copy any other keys that actually exist as columns
            foreach ($user as $key => $value) {
                if (in_array($key, $columns) && ! array_key_exists($key, $row)) {
                    $row[$key] = $value;
                }
            }

            // Ensure timestamps if present on table
            if (in_array('created_at', $columns) && ! isset($row['created_at'])) {
                $row['created_at'] = now();
            }
            if (in_array('updated_at', $columns) && ! isset($row['updated_at'])) {
                $row['updated_at'] = now();
            }

            // Fill missing NOT NULL columns with safe defaults to avoid SQL errors
            foreach ($colsInfo as $colName => $info) {
                if (array_key_exists($colName, $row)) {
                    continue;
                }

                // skip timestamps handled above
                if (in_array($colName, ['created_at', 'updated_at'])) {
                    continue;
                }

                // if column has a database default, skip
                if (! is_null($info['default'])) {
                    // do not set, DB will use default
                    continue;
                }

                if ($info['nullable']) {
                    $row[$colName] = null;
                    continue;
                }

                // Non-nullable and no default -> provide a safe default based on type
                $type = $info['type'];
                // handle date/time types first
                if (in_array($type, ['date','datetime','timestamp','time','year'])) {
                    if ($type === 'date') {
                        $row[$colName] = date('Y-m-d');
                    } elseif ($type === 'time') {
                        $row[$colName] = date('H:i:s');
                    } elseif ($type === 'year') {
                        $row[$colName] = date('Y');
                    } else {
                        // datetime/timestamp
                        $row[$colName] = date('Y-m-d H:i:s');
                    }
                } elseif (in_array($type, ['int','bigint','smallint','mediumint','tinyint','integer'])) {
                    $row[$colName] = 0;
                } elseif (in_array($type, ['decimal','float','double'])) {
                    $row[$colName] = 0;
                } else {
                    // string types -> empty string
                    $row[$colName] = '';
                }
            }

            // Only insert if we have at least one column to insert
            if (! empty($row)) {
                DB::table('users')->insert($row);
            }
        }


        // Seederek (Payment kell az OrderItem előtt)
        $this->call([
            HomeDeliverySeeder::class,
            PackageSeeder::class,
            ItemSeeder::class,
            CardDetailSeeder::class,
            PaymentSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            PackagePickupSeeder::class,
        ]);
    }
}
