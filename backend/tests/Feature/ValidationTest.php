<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class ValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_item_creation_validation_errors()
    {
        try {
            $user = User::factory()->create();
        } catch (\Throwable $e) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'validator@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        $this->actingAs($user);

        $resp = $this->postJson('/api/items', [
            // missing required fields
        ]);

        $this->assertEquals(422, $resp->getStatusCode());
    }
}
