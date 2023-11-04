"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const loginController_1 = require("./loginController");
const walletController_1 = require("./walletController");
const categoryController_1 = require("./categoryController");
exports.routes = express_1.default.Router();
// routes.use(defaultRoute);
exports.routes.use("/user", loginController_1.loginRoute);
exports.routes.use("/wallet", walletController_1.walletRoute);
exports.routes.use("/category", categoryController_1.categoryRoute);
