<?php

namespace App\Http\Controllers;

use App\Enums\LogAction;
use App\Http\Requests\StoreLogRequest;
use App\Models\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogController extends Controller
{
// Source - https://stackoverflow.com/a/20147885
// Posted by Senador, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-21, License - CC BY-SA 4.0

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}


    public function store(StoreLogRequest $request): JsonResponse
    {
        $acao = LogAction::fromInput($request->validated('action'));

        if (! $acao || ! $acao->allowedFromClient()) {
            return response()->json(['message' => 'Ação não permitida.'], 422);
        }

        $user = $request->attributes->get('jwt_user');

        $log = Log::create([
            'acao' => $acao,
            'detalhe' => $this->detalhe($request),
            'usuario_id' => $user['id'],
        ]);

        return response()->json($log, 201);
    }

    public function storeInternal(StoreLogRequest $request): JsonResponse
    {

        $acao = LogAction::fromInput($request->validated('action'));

        if (! $acao) {
            return response()->json(['message' => 'Ação inválida.'], 422);
        }

        $log = Log::create([
            'acao' => $acao,
            'detalhe' => $this->detalhe($request),
            'usuario_id' => $request->validated('usuarioId'),
        ]);

        return response()->json($log, 201);
    }

    public function index(Request $request): JsonResponse
    {


    debug_to_console("entroi");

        $user = $request->attributes->get('jwt_user');

        $request->validate([
            'acao' => ['nullable', 'string'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Log::query()->where('usuario_id', $user['id']);

        if ($request->filled('acao') && ($a = LogAction::fromInput($request->query('acao')))) {
            $query->where('acao', $a->value);
        }
        if ($request->filled('from')) {
            $query->where('timestamp', '>=', $request->query('from'));
        }
        if ($request->filled('to')) {
            $query->where('timestamp', '<=', $request->query('to'));
        }

        return response()->json(
            $query->orderByDesc('timestamp')->paginate($request->integer('per_page', 20))
        );
    }

    private function detalhe(StoreLogRequest $request): ?string
    {
        $msg = $request->validated('message');
        $todoId = $request->validated('todoId');

        return $todoId ? trim("[tarefa #{$todoId}] {$msg}") : $msg;
    }
}