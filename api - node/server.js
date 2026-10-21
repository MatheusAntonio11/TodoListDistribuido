import express from "express"
import index from "./route/index.js"

import defaultErrorHandler from "./middleware/defaultErrorHandler.js"

const server = express ();

server.disable("x-powered-by");
server.use(express.json());

server.use('/',index);

server.use(defaultErrorHandler);

server.listen(5050,()=>{
    console.log(`servidor inicado na porta ${5050}`)
})