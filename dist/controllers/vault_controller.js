"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawFundsFromVault = exports.AddFundsToVault = exports.Easysave = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const vault_model_1 = __importDefault(require("../models/vault_model"));
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Function to get vault details
async function Easysave(req, res) {
    var _a;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    console.log(user_id);
    try {
        const existingUser = await user_model_1.default.findOne({ _id: user_id });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist!",
            });
        }
        console.log(existingUser);
        const vaultAccount = await vault_model_1.default.findOne({
            usedId: user_id,
        });
        res.status(200).json({
            data: vaultAccount,
        });
    }
    catch (err) {
        res.status(400).json({ msg: "Something went wrong.. try again" });
    }
}
exports.Easysave = Easysave;
// Function add funds
async function AddFundsToVault(req, res) {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    console.log(userId);
    const { amount } = req.body;
    console.log(amount);
    const vaultSchema = joi_1.default.object({
        amount: joi_1.default.number().required(),
    });
    const vaultValidate = vaultSchema.validate(req.body);
    if (vaultValidate.error) {
        return res.status(400).json({
            message: vaultValidate.error.details[0].message,
        });
    }
    try {
        const existingUser = await user_model_1.default.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist!",
            });
        }
        let vaultAccount = await vault_model_1.default.findOne({
            userId,
        });
        console.log(vaultAccount);
        const vaultbalance = vaultAccount === null || vaultAccount === void 0 ? void 0 : vaultAccount.balance;
        const newBalance = vaultbalance + amount;
        let vaultAddFund = await vault_model_1.default.findOneAndUpdate({ userId: userId }, { balance: newBalance }, { new: true });
        res.status(200).json({
            msg: "Add Fund Successful!",
            data: vaultAddFund,
        });
    }
    catch (err) {
        res.status(400).json({ msg: "Something went wrong.. try again" });
    }
}
exports.AddFundsToVault = AddFundsToVault;
// Function add funds
async function WithdrawFundsFromVault(req, res) {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    console.log(userId);
    const { amount } = req.body;
    console.log(amount);
    const vaultSchema = joi_1.default.object({
        amount: joi_1.default.number().required(),
    });
    const vaultValidate = vaultSchema.validate(req.body);
    if (vaultValidate.error) {
        return res.status(400).json({
            message: vaultValidate.error.details[0].message,
        });
    }
    try {
        const existingUser = await user_model_1.default.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist!",
            });
        }
        let vaultAccount = await vault_model_1.default.findOne({
            userId,
        });
        console.log(vaultAccount);
        const balance = vaultAccount === null || vaultAccount === void 0 ? void 0 : vaultAccount.balance;
        console.log(balance);
        if (amount > balance) {
            return res.status(404).json({
                message: "Insufficient Funds!",
            });
        }
        if (amount < 0) {
            return res.status(404).json({
                message: "Please Enter a valid Amount!",
            });
        }
        const newBalance = balance - amount;
        let vaultAddFund = await vault_model_1.default.findOneAndUpdate({ userId: userId }, { balance: newBalance }, { new: true });
        res.status(200).json({
            msg: "Withdrawal  Successful!",
            data: vaultAddFund,
        });
    }
    catch (err) {
        res.status(400).json({ msg: "Something went wrong.. try again" });
    }
}
exports.WithdrawFundsFromVault = WithdrawFundsFromVault;
