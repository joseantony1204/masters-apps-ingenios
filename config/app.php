<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application, which will be used when the
    | framework needs to place the application's name in a notification or
    | other UI elements where an application name needs to be displayed.
    |
    */

    'name' => env('APP_NAME', 'INGENIOS SAS'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | the application so that it's available within Artisan commands.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. The timezone
    | is set to "UTC" by default as it is suitable for most use cases.
    |
    */

    'timezone' => 'America/Bogota',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by Laravel's translation / localization methods. This option can be
    | set to any locale for which you plan to have translation strings.
    |
    */

    'locale' => env('APP_LOCALE', 'es'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'es'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'es_CO'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /**
     * Token whatsapp de faccebook
     */
    //'whatsapptoken' => env('WHATSAPP_TOKEN','EAAna8tLwPREBRK9om4PS1rKpvqB6azsFVzQZAP7uCwh250S6VmmCi4e2xZCkKLEoZBvEABev5qZBzUbiIZAATBc3ABSSO29YpOQ77c1WZALiBtZAQOM1LfvMr39ZA7PbzNftQlwDPM9c99uVtEYvJWHodJsW34oTZCjZBdQKZBQcMJAYx37ZCmwSQGRNBItJt9bda4Ug394ZA3HRZAbf3MEghXtpPDHvjYfjvup2Jsixc3rHdt'),
    //'whatsapptoken' => env('WHATSAPP_TOKEN','EAASLwZAqwDvABRBMUPrxqpbJpf7HAIHn7NbuvQPVtwlDDa6ai2AO7gRqt30gOzAGVvMTWNZAZCM69oYwtd8XMduaBYIh9DhgqmfXSxZAj3ZAht1AYZBE6oue13AU51HaJn0v0YCBeVTpB9ZC7jD52DOP2b6OZCh6iOMYnr9GqwlBCpkzVRW7o1yka7wkOAFAl7Yjm5mwK1hywb2SW1VrCjGgr4FkzUba3AblJ51WZCtdQ'),
    'whatsapptoken' => env('WHATSAPP_TOKEN','EAASLwZAqwDvABRLHm5uMu8nCUzpZBf7XQ3Hv8oOc5XrzLTtkv8CY24MzbP5SE5drYV3N78ifFeZCBi5NbL3Mw9kzrAom39YZBVy8F7xWi7CddXHgG9bP3lyVvWbvMmzSIFVWTwnRjPwGnjHkpvdSK8SC81pB4DZAMzA7TkMtjFwZBPbVJriRRcZA1Y3ROV9DSXfcyhD3qVgkk2K5EarorAj6gnmPRoQHZCN96voe9rbZAYiOnt99vUI9O2dfL3HvrnEiXxPLjEFRGmvO9Jm4KfoT8RGfbYP7uzBBKcXB1rAZDZD'),
    'whatsapphonenumberid' => env('WHATSAPP_PHONE_NUMBER_ID','3242791258'),
    'whatsappversion' => env('WHATSAPP_API_VERSION','v25.0'),


    /**
     * Token WOMPI
     */
    'wompi_public_key' => env('WOMPI_PUBLIC_KEY','pub_prod_w5QyjkQ7CxUfhX41s1PYKbo4mtqaNZUW'),
    'wompi_integrity_secret' => env('WOMPI_INTEGRITY_SECRET','prod_integrity_q6Tfnvy1fpq9a9sFtlCxyBgADfwv13Yb'),
    'wompi_currency' => env('WOMPI_CURRENCY','COP'),
    'wompi_events_secret' => env('WOMPI_EVENTS_SECRET','prod_events_JOk8Z6uwhjuZ7OJE1QDQySq73kpzThqk'),
  
    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
