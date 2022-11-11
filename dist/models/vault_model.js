"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vaultSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    last_save: {
        type: String,
    },
    last_withdrawal: {
        type: String,
    },
    next_withdrawal: {
        type: String,
    },
    balance: {
        type: Number,
    },
    save_interval: {
        type: String,
    },
    next_save: {
        type: String,
    },
    active: {
        type: Boolean,
    },
    save_amount: {
        type: Number,
    },
    set_up: {
        type: Boolean,
    },
    card_ref: {
        type: String,
    },
});
const VaultModel = mongoose_1.default.model("vault", vaultSchema);
exports.default = VaultModel;
