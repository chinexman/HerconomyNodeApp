"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFundsToVault = exports.Easysave = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const vault_model_1 = __importDefault(require("../models/vault_model"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
//Function to register users
async function register(req, res) {
    console.log("model", user_model_1.default);
    try {
        const ValidateSchema = joi_1.default.object({
            first_name: joi_1.default.string().required().min(3).max(30),
            last_name: joi_1.default.string().required().min(3).max(30),
            email: joi_1.default.string().required().min(6).max(225).email(),
            password1: joi_1.default.string().required().min(6).max(255),
            password2: joi_1.default.string().required().min(6).max(255),
        });
        console.log("req.body==>", req.body);
        //Validating User
        const validateValue = ValidateSchema.validate(req.body);
        if (validateValue.error) {
            return res.status(400).json({
                message: validateValue.error.details[0].message,
            });
        }
        console.log("validateValue==>", validateValue);
        //check for existing email 
        const existingUser = await user_model_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(404).json({
                message: "User with this email already exists!",
            });
        }
        console.log("existingUser ==>", existingUser);
        // check for match password
        if (req.body.password1 !== req.body.password2) {
            return res.status(400).json({
                message: "Password mismatch",
            });
        }
        //Hash user password
        const hashPassword = bcrypt_1.default.hashSync(req.body.password1, 12);
        //Register user
        const { _doc: { password, ...value } } = await user_model_1.default.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email.toLowerCase(),
            password: hashPassword,
            education: [],
            // is_blocked : false,
        });
        console.log("value==>", value);
        const token = jsonwebtoken_1.default.sign({ user_id: value._id, user_email: value.email }, process.env.TOKEN_KEY, {
            expiresIn: process.env.TOKEN_EXPIRATION,
        });
        const vaultInstance = await vault_model_1.default.create({
            userId: value._id,
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
            card_ref: "",
        });
        res.status(201).json({
            token,
            data: value,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ msg: "Something went wrong.. try again" });
    }
}
exports.register = register;
async function login(req, res) {
    console.log("model", user_model_1.default);
    try {
        const ValidateSchema = joi_1.default.object({
            email: joi_1.default.string().required().min(6).max(225).email(),
            password: joi_1.default.string().required().min(6).max(255),
        });
        console.log("req.body==>", req.body);
        //Validating User
        const validateValue = ValidateSchema.validate(req.body);
        if (validateValue.error) {
            return res.status(400).json({
                message: validateValue.error.details[0].message,
            });
        }
        console.log("validateValue==>", validateValue);
        //check for existing email 
        const existingUser = await user_model_1.default.findOne({ email: req.body.email.toLowerCase() }).select("+password");
        if (!existingUser) {
            return res.status(404).json({
                message: "User with this email does not exists!",
            });
        }
        console.log("existingUser ==>", existingUser);
        // check for match password
        const passIsValid = bcrypt_1.default.compareSync(req.body.password, existingUser.password);
        if (!passIsValid) {
            return res.status(400).json({
                msg: "Invalid Password"
            });
        }
        const { _doc: { password, ...value } } = existingUser;
        const token = jsonwebtoken_1.default.sign({ user_id: existingUser._id, user_email: existingUser.email }, process.env.TOKEN_KEY, {
            expiresIn: process.env.TOKEN_EXPIRATION,
        });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({
            token,
            data: value,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ msg: "Something went wrong.. try again" });
    }
}
exports.login = login;
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
    const { balance } = req.body;
    console.log(balance);
    const vaultSchema = joi_1.default.object({
        balance: joi_1.default.number().required(),
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
        const vaultbalance = vaultAccount === null || vaultAccount === void 0 ? void 0 : vaultAccount.balance;
        const newBalance = vaultbalance + balance;
        let vaultAddFund = await vault_model_1.default.findOneAndUpdate({ userId: userId }, { balance: newBalance }, { new: true });
        res.status(200).json({
            data: vaultAddFund,
        });
    }
    catch (err) {
        res.status(400).json({ msg: "Something went wrong.. try again" });
    }
}
exports.AddFundsToVault = AddFundsToVault;
