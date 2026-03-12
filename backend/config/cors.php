<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Paths that should be accessible via CORS
    'paths' => [
        'api/*',
        'sanctum/*',
        'register',
        'login',
        'logout',
    ],

    // Allow all common HTTP methods
    'allowed_methods' => ['*'],

    // Allow the frontend origin (change if your frontend runs on a different host/port)
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    'allowed_origins_patterns' => [],

    // Allow all headers from the browser
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Allow cookies (credentials) to be sent
    'supports_credentials' => true,
];
