<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'max:40'],
            'message' => ['nullable', 'string', 'max:2000'],
            'todoId' => ['nullable', 'integer'],
            'usuarioId' => ['nullable', 'integer'], // só usado na rota interna
            'ip' => ['nullable', 'ip'],
        ];
    }
}
