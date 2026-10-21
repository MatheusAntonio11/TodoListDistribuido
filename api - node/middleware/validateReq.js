import { validationResult } from "express-validator";


const validateReq = (req,res,next)=>{
    const errors = validationResult(req);
if(!errors.isEmpty()){
    let error = {};
    errors.array().map((err) =>(error[err.param] = err.msg));
    return res.status(422).json({ 
        status: 422,
        message: "Validação não concluida",
        error }); 
}
next();
};

export default validateReq;
