import prisma from "../config/prismaClient.js"
import jwt from "jsonwebtoken";
import { respostaPadrao } from "../route/index.js";
import { SECRET_TOKEN_JWT } from "../config/env_config.js";

import { enviarLog } from "../service/logger.js";

export async function verifySession(req, res, next) {
    try {
        const authHeader = req.headers['cookie'];
        if (!authHeader) {
            enviarLog({ acao: "UNAUTHORIZED_ACCESS", detalhe: `Acesso sem token válido a ${req.originalUrl}` });
            return respostaPadrao(res, 401, "Não autorizado");         }
        const cookies = Object.fromEntries(
            authHeader.split(';').map(c => {
                const [key, ...v] = c.trim().split('=');
                return [key, v.join('=')];
            })
        );
        
        const accessToken = cookies.SessionID;
        if (!accessToken) {
                       enviarLog({ acao: "UNAUTHORIZED_ACCESS", detalhe: `Acesso sem token válido a ${req.originalUrl}` });
            return respostaPadrao(res, 401, "Não autorizado"); 
        }
        const checarBlacklist = await prisma.cookieBlackList.findUnique({
            where: { token: accessToken },
        });
        if (checarBlacklist) {
                    enviarLog({ acao: "UNAUTHORIZED_ACCESS", detalhe: `Acesso sem token válido a ${req.originalUrl}` });
            return respostaPadrao(res, 401, "Não autorizado");
        }

        jwt.verify(accessToken, SECRET_TOKEN_JWT, (err, decoded) => {
            if (err) {
                 enviarLog({ acao: "UNAUTHORIZED_ACCESS", detalhe: `Acesso sem token válido a ${req.originalUrl}` });
                return respostaPadrao(res, 401, "Sessão expirada. Faça o login novamente");
            }
          
            const { id, nome, email } = decoded;
            
            req.user = req.user || {};
            req.user.id = id;
            req.user.nome = nome;
            req.user.email = email;
            
            next();
        });

    } catch (err) {
        console.error("Erro ao verificar asessao:", err);
        return respostaPadrao(res, 500, "Erro interno do servidor");
    }
}