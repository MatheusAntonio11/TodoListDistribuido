import prisma from "../config/prismaClient.js"

export async function createTask_serv(titulo, descricao, userid){
try{

    const task = await prisma.task.create({
        data:{
            titulo:titulo,
            descricao:descricao,
            userid:userid
            
        }
    })
    return task;

}catch(err){
    console.log("erro service cria task");
    throw err;
}

}

export async function getTasksByUser_serv(userid) {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                userid: userid
            }
        });
        return tasks;
    } catch(err) {
        console.log("erro service busca tasks do usuario");
        throw err;
    }
}


export async function completeTask_serv(id, userid) {
    try {
        const task = await prisma.task.update({
            where: {
                id_userid: {
                    id: id,
                    userid: userid
                }
            },
            data: {
                concluida: true
            }
        });
        return task;
    } catch(err) {
        console.log("erro service conclui task");
        throw err;
    }
}