import prisma from "../../config/prismaClient.js"
import jwt from "jsonwebtoken";
import { respostaPadrao } from "../../route/index.js";
import { SECRET_TOKEN_JWT } from "../../config/env_config.js";

export default async function Logout(req, res) {
    try {
        const authHeader = req.headers['cookie'];
        if (!authHeader) return respostaPadrao(res, 204, "No content");

        const cookies = Object.fromEntries(
            authHeader.split(';').map(c => {
                const [key, ...v] = c.trim().split('=');
                return [key, v.join('=')];
            })
        );
        
        const accessToken = cookies.SessionID;
        if (!accessToken) return respostaPadrao(res, 204, "No content");

        const checarBlacklist = await prisma.cookieBlackList.findUnique({
            where: { token: accessToken },
        });
        if (checarBlacklist) return respostaPadrao(res, 204, "No content");
//console.log("1")
        let decoded;
        try {
            decoded = jwt.verify(accessToken, SECRET_TOKEN_JWT);
        } catch (err) {
            return respostaPadrao(res, 204, "No content");
        }

        const { id, exp, iat } = decoded; 

        const expireAt = new Date(exp * 1000);
        const createdAt = new Date(iat * 1000);
//console.log("2")
        await prisma.cookieBlackList.create({
            data: {
                token: accessToken,
                user_id: id,
                expire_at: expireAt,
                created_at: createdAt,
            },
        });

        res.clearCookie("SessionID");

        return respostaPadrao(res, 200, "Desconectado com sucesso.");

    } catch (err) {
        console.error("Erro no logout:", err);
        return respostaPadrao(res, 500, "Erro interno do servidor");
    }
}