import UserModel from "../models/user_model";
import VaultModel from "../models/vault_model";
import express, { Request, Response } from "express";
import Joi, { number } from "joi";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

type customRequest = Request & {
    user?: { user_id?: string; email?: string; }
}

type vaultInstance = {
    _id?: string,
    userId?: string,
    last_save?: string,
    last_withdrawal?: string,
    next_withdrawal?: string,
    balance?: number,
    channel?: string,
    save_interval?: string,
    save_amount?: number,
    next_save?: string,
    active?: boolean,
    set_up?: boolean,
    card_ref?: string,
    __v?: number,

}

// Function to get vault details
export async function Easysave(req: customRequest, res: Response) {
    const user_id = req.user?.user_id
    console.log(user_id)
    try {

        const existingUser = await UserModel.findOne({ _id: user_id });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist!",
            })
        }

        console.log(existingUser)
        const vaultAccount = await VaultModel.findOne({

            usedId: user_id,
        })

        res.status(200).json({

            data: vaultAccount,
        })

    } catch (err: any) {
        res.status(400).json({ msg: "Something went wrong.. try again" });

    }
}


// Function add funds
export async function AddFundsToVault(req: customRequest, res: Response) {
    const userId = req.user?.user_id
    console.log(userId)

    const { amount } = req.body;
    console.log(amount)
    const vaultSchema = Joi.object({
        amount: Joi.number().required(),
    });

    const vaultValidate = vaultSchema.validate(req.body);

    if (vaultValidate.error) {
        return res.status(400).json({
            message: vaultValidate.error.details[0].message,
        });
    }

    try {

        const existingUser = await UserModel.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist!",
            })
        }
        let vaultAccount = await VaultModel.findOne({
            userId,
        })

        console.log(vaultAccount)

        const vaultbalance = vaultAccount?.balance;
        const newBalance = vaultbalance + amount;
        let vaultAddFund = await VaultModel.findOneAndUpdate(

            { userId: userId },
            { balance: newBalance },
            { new: true }
        )
        res.status(200).json({
            msg: "Add Fund Successful!",
            data: vaultAddFund,
        })

    } catch (err: any) {
        res.status(400).json({ msg: "Something went wrong.. try again" });

    }
}

// Function add funds
export async function WithdrawFundsFromVault(req: customRequest, res: Response) {
    const userId = req.user?.user_id
    console.log(userId)
    const { amount } = req.body;
    console.log(amount)
    const vaultSchema = Joi.object({
        amount: Joi.number().required(),
    });

    const vaultValidate = vaultSchema.validate(req.body);

    if (vaultValidate.error) {
        return res.status(400).json({
            message: vaultValidate.error.details[0].message,
        });
    }

    try {

        const existingUser = await UserModel.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist!",
            })
        }

        let vaultAccount: any = await VaultModel.findOne({
            userId,
        })

        console.log(vaultAccount)
        const balance = vaultAccount?.balance;
        console.log(balance)
        if (amount > balance) {
            return res.status(404).json({
                message: "Insufficient Funds!",
            })
        }

        if (amount < 0) {
            return res.status(404).json({
                message: "Please Enter a valid Amount!",
            })
        }
        const newBalance = balance - amount;
        let vaultAddFund = await VaultModel.findOneAndUpdate(

            { userId: userId },
            { balance: newBalance },
            { new: true }


        )

        res.status(200).json({
            msg: "Withdrawal  Successful!",
            data: vaultAddFund,
        })

    } catch (err: any) {
        res.status(400).json({ msg: "Something went wrong.. try again" });

    }
}


