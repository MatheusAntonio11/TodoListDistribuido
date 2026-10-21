import { createUser_serv } from "../service/user_service.js";
import { respostaPadrao } from "../route/index.js";

import bcrypt from "bcrypt";

const hashSenha = async(senha)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha,salt);

    return hash;
}

const createUser = async (req,res,next) =>{
    const {nome,email,senha} = req.body;

    try{
            const senhaSegura = await hashSenha(senha);        
        const novoUser = await createUser_serv(nome,email,senhaSegura);
        respostaPadrao(res,201,"Usuario criado com sucesso", [novoUser]);
    
    }
    catch(err){
        next (err);
    }

}

export default {createUser}