<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Item;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_delete_item()
    {
        try {
            $user = User::factory()->create(['is_admin' => false]);
        } catch (\Throwable $e) {
            $user = User::create(['name' => 'User', 'email' => 'user@example.com', 'password' => bcrypt('password'), 'is_admin' => false]);
        }
        $this->actingAs($user);

        $item = Item::factory()->create();

        $resp = $this->deleteJson('/api/items/'.$item->id);

        $this->assertTrue(in_array($resp->getStatusCode(), [403, 401]));
    }

    public function test_admin_can_delete_item()
    {
        try {
            $admin = User::factory()->create(['is_admin' => true]);
        } catch (\Throwable $e) {
            $admin = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password'), 'is_admin' => true]);
        }
        $this->actingAs($admin);

        $item = Item::factory()->create();

        $resp = $this->deleteJson('/api/items/'.$item->id);

        $this->assertEquals(204, $resp->getStatusCode());
    }
}
