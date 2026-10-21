import express from "express"
import { respostaPadrao } from "../index.js"
import task from "../../controller/task/task_controller.js"
import { body } from "express-validator"


const router = express.Router()

router.get("/",(req,res)=>{
    respostaPadrao(res,200,`Bom dia/ Boa tarde/ Boa noite ${req.user.id} ${req.user.nome}, tela inicial de Tarefas para o Todo List`);
})

router.post("/create", 
    body("titulo").notEmpty().withMessage("Digite um título"),
    task.createTask )
router.get("/list",task.getTasks)
router.put("/complete/:id",task.completeTask)

export default router;