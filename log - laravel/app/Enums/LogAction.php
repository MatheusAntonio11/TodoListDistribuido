<?php

namespace App\Enums;

enum LogAction: string
{
    case TASK_CREATED = 'TASK_CREATED';
    case TASK_COMPLETED = 'TASK_COMPLETED';
    case UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS';
    case ERROR = 'ERROR';

    /** Converte o que o front/Node envia ("CREATE", "COMPLETE"...) para o enum. */
    public static function fromInput(string $value): ?self
    {
        return match (strtoupper(trim($value))) {
            'CREATE', 'TASK_CREATED' => self::TASK_CREATED,
            'COMPLETE', 'COMPLETED', 'TASK_COMPLETED' => self::TASK_COMPLETED,
            'UNAUTHORIZED', 'UNAUTHORIZED_ACCESS' => self::UNAUTHORIZED_ACCESS,
            'ERROR' => self::ERROR,
            default => null,
        };
    }

    /** Ações que o front-end (usuário autenticado) pode registrar. */
    public function allowedFromClient(): bool
    {
        return in_array($this, [self::TASK_CREATED, self::TASK_COMPLETED], true);
    }
}
