<?php

namespace App\Models;

use App\Enums\LogAction;
use Illuminate\Database\Eloquent\Model;
use LogicException;

class Log extends Model
{
    protected $table = 'logs';
    public $timestamps = false;

    protected $fillable = ['acao', 'detalhe', 'usuario_id', 'timestamp'];

    protected $casts = [
        'acao' => LogAction::class,
        'timestamp' => 'datetime',
        'usuario_id' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(fn (Log $log) => $log->timestamp ??= now());

        // Logs são imutáveis
        static::updating(fn () => throw new LogicException('Logs não podem ser alterados.'));
        static::deleting(fn () => throw new LogicException('Logs não podem ser removidos.'));
    }
}
