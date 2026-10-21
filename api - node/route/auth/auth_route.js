import express, { Router } from "express"
import { body } from "express-validator";

import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js"

import validateReq from "../../middleware/validateReq.js";
import { verifySession } from "../../middleware/verifySession.js";
import { SECRET_TOKEN_JWT } from "../../config/env_config.js";

import login from "../../controller/auth/login.js";
import Logout from "../../controller/auth/logout.js";
import user from "../../controller/user_controller.js"
import { respostaPadrao } from "../index.js";

import { enviarLog } from "../../service/logger.js";

const router = express.Router();


router.post("/login",
  body("senha").notEmpty().withMessage("Digite a senha"),
  body("email").isEmail().withMessage("Digite um email valido").notEmpty().withMessage("Digite o email"),
  validateReq,
    
  async (req,res,next)=>{

  try{
    const authHeader = req.headers['cookie'];
        if (!authHeader) return next();         
        const cookies = Object.fromEntries(
            authHeader.split(';').map(c => {
                const [key, ...v] = c.trim().split('=');
                return [key, v.join('=')];
            })
        );
        
        const accessToken = cookies.SessionID;
        if (!accessToken) return next(); 

        const checarBlacklist = await prisma.cookieBlackList.findUnique({
            where: { token: accessToken },
        });
        if (checarBlacklist) return next();

        jwt.verify(accessToken, SECRET_TOKEN_JWT, (err, decoded) => {
            if (err) {
                return next();
            }}); 
enviarLog({ acao: "UNAUTHORIZED_ACCESS", detalhe: "Tentativa de login com sessão ativa"});
return respostaPadrao(res,401,"Você ja esta logado");


  } catch(err){
      console.error(err);
  
} 
},login);


router.get("/logout",verifySession,Logout);

const validacaoRegister = [
    body("senha").notEmpty().withMessage("Digite uma senha"),

    body('email')
  .isEmail()
  .withMessage('Must be a valid email address')
  .custom(async (value) => {
    const user = await prisma.user.findUnique({
      where: { email: value },
    });

    if (user) {
      throw new Error('email ja cadastrado.');
    }
  })
.isEmail().withMessage("Digite um emaail válido")
.notEmpty().withMessage("Digite um email"),

body("nome").notEmpty().withMessage("Digite um nome"),

validateReq

];

router.post("/register",validacaoRegister,user.createUser);


export default router;