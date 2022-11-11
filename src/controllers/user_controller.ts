import UserModel from "../models/user_model";
import VaultModel from "../models/vault_model";
import express , { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

type customRequest = Request & {
    user?: {user_id?:string; email?:string;}
}

//Function to register users
export async function  register(req: Request, res: Response){
console.log("model",UserModel);
try{
 const ValidateSchema = Joi.object({
     first_name: Joi.string().required().min(3).max(30),
     last_name : Joi.string().required().min(3).max(30),
     email : Joi.string().required().min(6).max(225).email(),
     password1 : Joi.string().required().min(6).max(255),
     password2 : Joi.string().required().min(6).max(255),

 })

 console.log("req.body==>", req.body);
 //Validating User
 const validateValue = ValidateSchema.validate(req.body);
 if(validateValue.error){
     return res.status(400).json({
         message: validateValue.error.details[0].message,
     })
 } 

 console.log("validateValue==>",validateValue);


 //check for existing email 
const existingUser = await UserModel.findOne({email: req.body.email});
if(existingUser){
    return res.status(404).json({
        message : "User with this email already exists!",
    })
}

console.log("existingUser ==>", existingUser);
// check for match password
if(req.body.password1 !== req.body.password2){
    return res.status(400).json({
        message : "Password mismatch",
    })
}


//Hash user password
const hashPassword = bcrypt.hashSync(req.body.password1, 12);


//Register user
const {_doc: {password, ...value}}: any = await UserModel.create({
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email.toLowerCase(),
    password : hashPassword,
    education : [],
    // is_blocked : false,

})

console.log("value==>", value);

const token = jwt.sign(
    { user_id: value._id, user_email: value.email },
    process.env.TOKEN_KEY as string,
    {
      expiresIn: process.env.TOKEN_EXPIRATION,
    }
  );


const vaultInstance =  await VaultModel.create({
   userId : value._id,
   last_save: "",
   last_withdrawal: "",
   next_withdrawal: "",
   balance: 0.00,
   channel: "",
   save_interval: "",
   save_amount: 0.00,
   next_save: "",
   active: false,
   set_up: false,
   card_ref : "",

    
    
})

res.status(201).json({
    token,
    data : value,
})



}catch(err:any){
   console.log(err);
    res.status(400).json({msg: "Something went wrong.. try again"});
}


}



export async function  login(req: Request, res: Response){
    console.log("model",UserModel);
    try{
     const ValidateSchema = Joi.object({
        
         email : Joi.string().required().min(6).max(225).email(),
         password : Joi.string().required().min(6).max(255),
       
    
     })
    
     console.log("req.body==>", req.body);
     //Validating User
     const validateValue = ValidateSchema.validate(req.body);
     if(validateValue.error){
         return res.status(400).json({
             message: validateValue.error.details[0].message,
         })
     } 
    
     console.log("validateValue==>",validateValue);
    
    
     //check for existing email 
    const existingUser = await UserModel.findOne({email: req.body.email.toLowerCase()}).select("+password");
    if(!existingUser){
        return res.status(404).json({
            message : "User with this email does not exists!",
        })
    }
    
    console.log("existingUser ==>", existingUser);
    // check for match password
    const passIsValid = bcrypt.compareSync(
        req.body.password , existingUser.password
    )

    if(!passIsValid){
        return res.status(400).json({
            msg : "Invalid Password"
        })
    }

 
    const {_doc: {password, ...value}}: any = existingUser
    
    const token = jwt.sign(
        { user_id: existingUser._id, user_email: existingUser.email },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_EXPIRATION,
        }
      );
    

      res.cookie("token", token, { httpOnly: true });




    res.status(200).json({
        token,
        data : value,
    })

    }catch(err:any){
       console.log(err);
        res.status(400).json({msg: "Something went wrong.. try again"});
    }
    
    
    }

// Function to get vault details
export async function Easysave (req:customRequest,res:Response){
    const user_id = req.user?.user_id
    console.log(user_id)
  try{ 

    const existingUser = await UserModel.findOne({ _id: user_id });
    if(!existingUser){
        return res.status(404).json({
            message : "User does not exist!",
        })
    }

    console.log(existingUser)
    const vaultAccount = await VaultModel.findOne({

      usedId : user_id,  
    })

    res.status(200).json({
        
        data : vaultAccount,
    })

}catch(err:any){
    res.status(400).json({msg: "Something went wrong.. try again"});

}
    }
    

     // Function add funds
     export async function AddFundsToVault (req:customRequest,res:Response){
        const userId = req.user?.user_id
        console.log(userId)

        const {balance} = req.body;
  console.log(balance)
        const vaultSchema = Joi.object({
            balance: Joi.number().required(),
          });
        
          const vaultValidate = vaultSchema.validate(req.body);
        
          if (vaultValidate.error) {
            return res.status(400).json({
              message: vaultValidate.error.details[0].message,
            });
          }

      try{ 
    
        const existingUser = await UserModel.findOne({ _id: userId });
        if(!existingUser){
            return res.status(404).json({
                message : "User does not exist!",
            })
        }
    
        let vaultAccount = await VaultModel.findOne({
    
          userId , 
          
          
        })

        const vaultbalance = vaultAccount?.balance;
        const newBalance = vaultbalance + balance;


        let vaultAddFund = await VaultModel.findOneAndUpdate(
    
            {userId:userId}, 
            {balance : newBalance},
            { new: true }

            
          )



        res.status(200).json({
            
            data : vaultAddFund,
        })
    
    }catch(err:any){
        res.status(400).json({msg: "Something went wrong.. try again"});
    
    }
        }