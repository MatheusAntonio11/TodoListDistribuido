import prisma from "../../config/prismaClient.js"
import bcrypt from "bcrypt"

import criaCookie from "../../config/cookieOptions.js"

import { respostaPadrao } from "../../route/index.js";
import { enviarLog } from "../../service/logger.js";

export default async function login(req, res) {
    const { email, senha } = req.body;

    try {
        const resultado = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!resultado) {
            enviarLog({ acao: "UNAUTHORIZED_ACCESS", detalhe: "Tentativa de login com informações erradas" });
            return respostaPadrao(res, 401, "Matricula ou senha incorretos. Tente novamente.");
        }

        const isSenhaValida = await bcrypt.compare(senha, resultado.senha);

        if (!isSenhaValida) {
            enviarLog({ acao: "UNAUTHORIZED_ACCESS", detalhe: "Tentativa de login com informações erradas"  });
            return respostaPadrao(res, 401, "Matricula ou senha incorretos. Tente novamente.");
        }

        const { senha: _senha, ...dados } = resultado;

        const token = criaCookie(res, "SessionID", dados, 30 * 60 * 1000);
        console.log(dados.id)
        console.log("Token de Login: " + token);

        enviarLog({ acao: "TASK_COMPLETED", detalhe: "Login Correto" });
        return respostaPadrao(res, 200, "Logado com sucesso", [dados]);

    } catch (error) {
        console.error("error login:", error);
        return respostaPadrao(res, 500, "Erro interno no servidor.");
    }
}