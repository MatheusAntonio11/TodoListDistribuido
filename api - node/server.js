import express from "express"
import { PORT } from "./config/env_config.js"
import index from "./route/index.js"
import cors from "cors"
import defaultErrorHandler from "./middleware/defaultErrorHandler.js"

const server = express ();

server.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],  // origens exatas do front
    credentials: true
}));

server.disable("x-powered-by");
server.use(express.json());

server.use('/',index);

server.use(defaultErrorHandler);

server.listen(PORT,()=>{
    console.log(`servidor inicado na porta ${PORT}`)
})