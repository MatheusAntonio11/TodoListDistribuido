import { Router } from "express";
import prisma from "../config/prismaClient.js";                       
import { enviarLog } from "../service/logger.js";
import { respostaPadrao } from "../route/index.js";
import { verifySession  } from "../middleware/verifySession.js"; 


const router = Router();

async function buscarTarefaDoUsuario(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        respostaPadrao(res, 400, "Id inválido");
        return null;
    }

    const task = await prisma.task.findFirst({ where: { id } });

    if (!task) {
        respostaPadrao(res, 404, "Tarefa não encontrada");
        return null;
    }

    if (task.userid !== req.user.id) {
        enviarLog({
            acao: "UNAUTHORIZED",
            detalhe: `Tentou acessar tarefa de outro usuário (${req.method} /todos/${id})`,
            usuarioId: req.user.id,
            todoId: id,
        });
        respostaPadrao(res, 404, "Tarefa não encontrada");
        return null;
    }

    return task;
}

async function listarTarefas(req, res, next) {
    try {
        const tasks = await prisma.task.findMany({
            where: { userid: req.user.id },
            orderBy: { id: "desc" },
        });
        return respostaPadrao(res, 200, "Tarefas listadas com sucesso", tasks);
    } catch (err) {
        next(err);
    }
}

async function atualizarTarefa(req, res, next) {
    try {
        const task = await buscarTarefaDoUsuario(req, res);
        if (!task) return;

        const { titulo, descricao } = req.body;
        const concluida = req.body.concluida ?? req.body.completed;

        const data = {};
        if (typeof titulo === "string" && titulo.trim()) data.titulo = titulo.trim();
        if (descricao !== undefined) data.descricao = descricao;
        if (typeof concluida === "boolean") data.concluida = concluida;

        if (!Object.keys(data).length) {
            return respostaPadrao(res, 400, "Nada para atualizar");
        }

        const atualizada = await prisma.task.update({
            where: { id_userid: { id: task.id, userid: req.user.id } },
            data,
        });

        if (data.concluida === true && !task.concluida) {
            enviarLog({
                acao: "COMPLETE",
                detalhe: `Tarefa "${atualizada.titulo}" concluída`,
                usuarioId: req.user.id,
                todoId: task.id,
            });
        }

        return respostaPadrao(res, 200, "Tarefa atualizada com sucesso", [atualizada]);
    } catch (err) {
        next(err);
    }
}

async function deletarTarefa(req, res, next) {
    try {
        const task = await buscarTarefaDoUsuario(req, res);
        if (!task) return;

        await prisma.task.delete({
            where: { id_userid: { id: task.id, userid: req.user.id } },
        });

        return respostaPadrao(res, 200, "Tarefa removida com sucesso");
    } catch (err) {
        next(err);
    }
}

router.get("/todos", verifySession, listarTarefas);
router.put("/todos/:id", verifySession, atualizarTarefa);
router.delete("/todos/:id", verifySession, deletarTarefa);


export default router;
