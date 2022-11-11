import { JwtPayload } from "jsonwebtoken";
import {Request} from "express";
import mongoose from "mongoose";



interface UserInterface {
    first_name : string;
    last_name : string;
    email : string;
    password : string;
    education : [string];
    // is_blocked : string;
}

interface VaultInterface {
        userId : mongoose.Schema.Types.ObjectId,
        last_save: string,
        last_withdrawal: string,
        next_withdrawal: string,
        balance: number,
        channel: string,
        save_interval: string,
        save_amount: number,
        next_save: string,
        active: boolean,
        set_up: boolean,
        card_ref : string,
    // is_blocked : string;
}

interface UserRequestInterface extends Request {
    user?:string | JwtPayload
}

export {
    UserInterface,
    UserRequestInterface,
    VaultInterface,
}