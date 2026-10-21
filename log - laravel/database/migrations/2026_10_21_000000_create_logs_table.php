<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->increments('id');                       // serial (Int), igual ao Prisma
            $table->string('acao', 40)->index();
            $table->text('detalhe')->nullable();
            $table->integer('usuario_id')->nullable()->index();   // Int, igual a "User".id
            $table->timestamp('timestamp')->useCurrent()->index();

            // Banco compartilhado: FK real para a tabela criada pelo Prisma ("User").
            // Nullable porque acesso sem token não tem usuário.
            $table->foreign('usuario_id')->references('id')->on('User')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};
