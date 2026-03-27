<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_authentication_with_acting_as()
    {
        // try factory, fallback to direct create if factory not present
        try {
            $user = User::factory()->create();
        } catch (\Throwable $e) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'testuser@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        $this->actingAs($user);

        $this->assertAuthenticated();
    }
}
