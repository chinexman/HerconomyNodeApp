"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function LoginAuthorization(req, res, next) {
    const userToken = req.headers.token || "";
    console.log(userToken);
    if (!userToken) {
        return res.status(401).json({
            status: "you are not an authorized  user",
            message: "Enter login details to have access",
        });
    }
    try {
        const LoginAuthorization = jsonwebtoken_1.default.verify(userToken.toString(), process.env.TOKEN_KEY || "");
        req.user = LoginAuthorization;
        console.log(req.user);
        next();
    }
    catch (err) {
        res.status(401).json({
            status: "Failed",
            message: "Invalid token"
        });
    }
}
exports.default = LoginAuthorization;
