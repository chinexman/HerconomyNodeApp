import jwt from "jsonwebtoken";
import {Response, NextFunction} from "express";
import { UserRequestInterface} from "../interfaces/interface"


function LoginAuthorization(

    req : UserRequestInterface,
    res : Response,
    next : NextFunction
){
const userToken = req.headers.token || "";
console.log(userToken)
if(!userToken){
    return res.status(401).json({
        status : "you are not an authorized  user",
        message : "Enter login details to have access",

    })
}

try{
    const LoginAuthorization = jwt.verify(
        userToken.toString(),
        process.env.TOKEN_KEY || ""
    );
    req.user = LoginAuthorization;
    console.log(req.user)
    next();
} catch(err){
    res.status(401).json({
        status : "Failed",
        message : "Invalid token"
    })
}

}

export default LoginAuthorization

