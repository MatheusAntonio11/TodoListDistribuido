import jwt from "jsonwebtoken";
import { SECRET_TOKEN_JWT } from "../config/env_config.js";



export default function criaCookie(res,nomeCookie, payload,maxAge){

    const token =  jwt.sign(payload,SECRET_TOKEN_JWT,{
        expiresIn:'30m' 
    });

    let options ={
        maxAge,
        httpOnly: true,
        secure: true,
        sameSite: "None", 
    };

    res.cookie(nomeCookie,token,options);

return token;
}
