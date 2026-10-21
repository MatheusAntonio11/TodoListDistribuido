import prisma from "../config/prismaClient.js"

export async function createUser_serv(nome,email,senha){
    try{
console.log(`nome:${nome}\nemail:${email}\nsenha:${senha}`)

        const user = await prisma.user.create({
            data:{
                nome:nome,
                email:email,
                senha:senha,
            },
        });
        return user;
    }

    catch(err){
        console.log("error service cria user");
            throw err;
    }
}