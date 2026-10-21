<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Valida o JWT HS256 emitido pela API Node.
 * Aceita "Authorization: Bearer <token>" ou cookie (nome em JWT_COOKIE_NAME).
 * Payload esperado: id, email, nome, created_at.
 */
class JwtAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->cookie(config('services.jwt.cookie'));

        if (! $token) {
            return response()->json(['message' => 'Token ausente.'], 401);
        }

        try {
            $payload = (array) JWT::decode($token, new Key(config('services.jwt.secret'), 'HS256'));
        } catch (Throwable $e) {
            return response()->json(['message' => 'Token inválido ou expirado.'], 401);
        }

        if (empty($payload['id'])) {
            return response()->json(['message' => 'Token sem id de usuário.'], 401);
        }

        $request->attributes->set('jwt_user', [
            'id' => (int) $payload['id'],
            'email' => $payload['email'] ?? null,
            'nome' => $payload['nome'] ?? null,
        ]);

        return $next($request);
    }
}
