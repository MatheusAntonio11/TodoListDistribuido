<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = (string) config('services.logs.service_key');
        $given = (string) $request->header('X-Service-Key');

        if ($expected === '' || ! hash_equals($expected, $given)) {
            return response()->json(['message' => 'Chave de serviço inválida.'], 401);
        }

        return $next($request);
    }
}
