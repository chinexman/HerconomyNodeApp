import mongoose from "mongoose";
import {VaultInterface} from "../interfaces/interface"

const vaultSchema = new mongoose.Schema<VaultInterface>({
    
    userId : {
       type : mongoose.Schema.Types.ObjectId,
       required : true,
       ref : "user" ,
    },
    
    last_save : {
        type : String,
    },
    last_withdrawal : {
        type : String,
    },
    next_withdrawal : {
        type : String,
      
    },
    balance: {
        type : Number,

    },
    save_interval :{
     type: String,
    },
    next_save : {
        type : String,

    },
    active: {
        type : Boolean,

    },

    save_amount : {
        type : Number,

    },

    set_up : {
        type : Boolean,

    },
    card_ref: {
        type : String,

    },
        

   
})
const VaultModel = mongoose.model("vault",vaultSchema)
export default VaultModel;