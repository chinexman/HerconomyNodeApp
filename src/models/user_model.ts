import mongoose from "mongoose";
import {UserInterface} from "../interfaces/interface"

const userSchema = new mongoose.Schema<UserInterface>({
    first_name : {
        type : String,
        required : true,      
    },
    last_name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        select : false,
        required : true,
        min : 6,
        max : 1024,

    },
    // is_blocked :{
    //  type: String,
    // },
    education : [{
        type : String,

    }],
   
})
const UserModel = mongoose.model("user",userSchema)
export default UserModel;