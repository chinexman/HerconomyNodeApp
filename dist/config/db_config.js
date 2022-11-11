"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
console.log("==>", process.env.DATABASE_URL);
function connect() {
    mongoose_1.default.connect(process.env.DATABASE_URL)
        .then(() => console.log("we are going live in 5,4,3,2,1"))
        .catch((err) => console.log("Error Connecting to Database => ", err));
}
exports.default = connect;
