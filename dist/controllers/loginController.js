"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoute = void 0;
const express_1 = require("express");
const loginService_1 = __importDefault(require("../services/loginService"));
const ts_md5_1 = require("ts-md5");
exports.loginRoute = (0, express_1.Router)();
const saltRounds = 8;
exports.loginRoute.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        username: req.body.username,
        password: yield ts_md5_1.Md5.hashStr(req.body.password),
    };
    try {
        var token;
        yield loginService_1.default.login(user).then((result) => {
            token = result !== null && result !== void 0 ? result : "0";
        });
        if (!!token) {
            res.send(token);
        }
        else {
            throw new Error("Login Failed");
        }
    }
    catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
}));
