import { enviarLog } from "../service/logger.js";

const errorHandling = (err, req, res, next) => {
  console.log(err.stack);
  enviarLog({
    acao: "ERROR",
    detalhe: `${req.method} ${req.originalUrl} -> ${err.message}`,
    usuarioId: req.user?.id ?? null,   
  });
  res.status(500).json({ status: 500, message: "Algo deu errado.", error: err.message });
};
export default errorHandling;