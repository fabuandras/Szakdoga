<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_user_id(): void
    {
        $user = User::factory()->create();
        $this->withoutMiddleware()->getJson('/api/users/' . $user->id)
            ->assertStatus(200);
    }

    public function test_users_index_returns_created_users(): void
    {
        $users = User::factory()->count(3)->create();
        $this->withoutMiddleware()->getJson('/api/users')
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_user_update_changes_name(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);
        $payload = ['name' => 'New Name'];
        $this->withoutMiddleware()->patchJson('/api/users/' . $user->id, $payload)
            ->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'New Name']);
    }
}
