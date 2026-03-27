<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Item;

class DatabaseIntegrityTest extends TestCase
{
    use RefreshDatabase;

    public function test_release_decrements_stock_and_fails_when_insufficient()
    {
        try {
            $user = User::factory()->create();
        } catch (\Throwable $e) {
            $user = User::create(['name' => 'User', 'email' => 'user2@example.com', 'password' => bcrypt('password')]);
        }
        $this->actingAs($user);

        try {
            $item = Item::factory()->create(['akt_keszlet' => 5]);
        } catch (\Throwable $e) {
            $item = Item::create(['elnevezes' => 'Test', 'akt_keszlet' => 5, 'egyseg_ar' => 100]);
        }

        // release 3 - should succeed
        $resp1 = $this->postJson('/api/items/'.$item->id.'/release', ['quantity' => 3]);
        $this->assertTrue(in_array($resp1->getStatusCode(), [200, 201]));

        $item->refresh();
        $this->assertEquals(2, $item->akt_keszlet);

        // release 5 - should fail with 422
        $resp2 = $this->postJson('/api/items/'.$item->id.'/release', ['quantity' => 5]);
        $this->assertEquals(422, $resp2->getStatusCode());
    }
}
