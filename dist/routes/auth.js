"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user_controller");
const vault_controller_1 = require("../controllers/vault_controller");
const user_authorization_1 = __importDefault(require("../Auth/user_authorization"));
const vault_controller_2 = require("../controllers/vault_controller");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
router.get("/autosave/get_easy_save", user_authorization_1.default, vault_controller_1.Easysave);
router.post("/autosave/addfund", user_authorization_1.default, vault_controller_2.AddFundsToVault);
router.post("/autosave/withdraw", user_authorization_1.default, vault_controller_2.WithdrawFundsFromVault);
exports.default = router;
