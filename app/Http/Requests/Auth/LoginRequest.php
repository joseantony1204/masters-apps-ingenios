<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Quitamos la regla 'email' para que permita texto normal (username)
            'email' => ['required', 'string'], 
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $loginValue = $this->input('email');
        $password = $this->password;
        $remember = $this->boolean('remember');

        // 1. Identificar el campo primario
        if (filter_var($loginValue, FILTER_VALIDATE_EMAIL)) {
            $field = 'email';
            $attempt = Auth::attempt([$field => $loginValue, 'password' => $password], $remember);
        } else {
            // Si es numérico, intentamos PRIMERO por username (que es lo más común en tu caso)
            // y si falla, intentamos por telefonomovil.
            
            // Intento A: Por Username
            $attempt = Auth::attempt(['username' => $loginValue, 'password' => $password], $remember);

            // Intento B: Si falló el A y es numérico, probamos por Teléfono
            if (!$attempt && is_numeric($loginValue)) {
                $attempt = Auth::attempt(['telefonomovil' => $loginValue, 'password' => $password], $remember);
            }
        }

        // 2. Verificar si alguno de los intentos fue exitoso
        if (! $attempt) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // 3. REGLA DE ORO: Una vez autenticado, verificamos que tenga un comercio activo
        $user = Auth::user();
        
        // Si tu lógica de "regla de oro" requiere que el usuario tenga un comercio activo para entrar:
        $tieneAcceso = \App\Models\Cfpersonascomercios::where('persona_id', $user->persona_id)
            ->where('activo', 1)
            ->exists();

        if (!$tieneAcceso && $user->perfil_id != 1) { // Suponiendo que el perfil 1 es SuperAdmin y no necesita esto
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Su usuario no tiene un comercio activo asignado actualmente.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        // Usamos el string plano del input para la llave del limitador
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}