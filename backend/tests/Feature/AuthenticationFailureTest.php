<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationFailureTest extends TestCase
{
    use RefreshDatabase;

    public function test_failed_authentication_returns_unauthorized()
    {
        $resp = $this->postJson('/api/login', [
            'email' => 'no-such-user@example.com',
            'password' => 'invalid',
        ]);

        $this->assertTrue(in_array($resp->getStatusCode(), [401, 422]));
    }
}
