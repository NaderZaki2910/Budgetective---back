"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoute = void 0;
const express_1 = require("express");
const loginRepo_1 = __importDefault(require("../repositories/loginRepo"));
exports.loginRoute = (0, express_1.Router)();
exports.loginRoute.post("/login", (req, res) => {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    const user = {
        username: username,
        password: password,
    };
    loginRepo_1.default.login(user);
    res.send(`username:${username}, password:${password}`);
});
