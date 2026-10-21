import { createTask_serv, getTasksByUser_serv,completeTask_serv } from "../../service/task_service.js";
import { respostaPadrao } from "../../route/index.js";

import prisma from "../../config/prismaClient.js";


const createTask = async(req,res,next)=>{
    const {titulo,descricao} = req.body

    console.log("ID USUARIO " +req.user.id)

    try{
    const userExiste = await prisma.user.findUnique({
        where: {id:req.user.id}
    })
        if (!userExiste) {
            respostaPadrao(res,404,"Usuario não encontrado")
    }
        const novaTask = await createTask_serv(titulo,descricao,req.user.id);
            respostaPadrao(res,201,"Tarefa criada com sucesso", [novaTask])



    }catch(err){
        next(err)
    }

}


const getTasks = async (req, res, next) => {

    try {
        const userExiste = await prisma.user.findUnique({
            where: { id: req.user.id }
        })
        if (!userExiste) 
            return respostaPadrao(res, 404, "Usuario não encontrado")

        const tasks = await getTasksByUser_serv(req.user.id);
        respostaPadrao(res, 200, "Tarefas listadas com sucesso", tasks);

    } catch (err) {
        next(err); 
    }
}

const completeTask = async (req, res, next) => {
    const { id } = req.params; 

    try {
        const userExiste = await prisma.user.findUnique({
            where: { id: req.user.id }
        })
        if (!userExiste) 
            return respostaPadrao(res, 404, "Usuario não encontrado")

        const taskAtualizada = await completeTask_serv(Number(id), req.user.id);
        respostaPadrao(res, 200, "Tarefa concluída com sucesso", [taskAtualizada]);

    } catch (err) {
        next(err);
    }
}

export default { createTask, getTasks, completeTask }

