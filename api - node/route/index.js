import express, { Router } from "express"
import auth from "./auth/auth_route.js"
import task from "./task/task__route.js"
import { verifySession } from "../middleware/verifySession.js";
import todosRoutes from "./todos.js";
  

const router = express.Router();

export const respostaPadrao = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  })
};

router.get('/',(req,res)=>{
    
    res.status(200).send({
        success:true,
        message:"Voce esta no sistema, mas em uma rota publica ainda, vá para a o login para testar"
    })

});

router.use("/auth",auth);
router.use("/todo",verifySession,task);
router.use(todosRoutes);

router.use((req,res)=>{
    res.status(404).json({
        status:404,
        message:"Rota não encontrada"
    })
});

export default router;