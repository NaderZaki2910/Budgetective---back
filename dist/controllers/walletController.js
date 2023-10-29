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
exports.walletRoute = void 0;
const express_1 = require("express");
const walletService_1 = __importDefault(require("../services/walletService"));
exports.walletRoute = (0, express_1.Router)();
exports.walletRoute.post("/addWallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.status(401).send();
    }
    else {
        const wallet = {
            name: req.body.name,
            description: req.body.description,
            amount: req.body.amount,
        };
        const token = req.headers.authorization;
        try {
            var result;
            yield walletService_1.default
                .addWallet(wallet, token)
                .then((result) => {
                console.log(result.output["output"]);
                if (!result.output["output"] || result.output["output"] == 0) {
                    throw new Error("Failed to add wallet");
                }
                else {
                    res.send({ result: true });
                }
            })
                .catch((err) => {
                throw err;
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ result: true, err: err });
        }
    }
}));
exports.walletRoute.get("/getWallets", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.status(401).send();
    }
    else {
        const token = req.headers.authorization;
        const { query } = req;
        const page = query.page;
        const pageSize = query.pageSize;
        if (!!page &&
            !!pageSize &&
            typeof page === "string" &&
            typeof pageSize === "string") {
            try {
                yield walletService_1.default
                    .getWallets(token, parseInt(page), parseInt(pageSize))
                    .then((result) => {
                    if (!result) {
                        throw new Error("Failed to get wallet");
                    }
                    else {
                        console.log(result, "after paging");
                        res.send(result);
                    }
                })
                    .catch((err) => {
                    throw err;
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send({ result: true, err: err });
            }
        }
        else {
            res.status(400).send(new Error("Wrong Parameters"));
        }
    }
}));
exports.walletRoute.get("/getWalletsStats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.status(401).send();
    }
    else {
        const token = req.headers.authorization;
        try {
            yield walletService_1.default
                .getWalletsStats(token)
                .then((result) => {
                if (!result) {
                    throw new Error("Failed to get wallet");
                }
                else {
                    console.log(result);
                    res.send(result);
                }
            })
                .catch((err) => {
                throw err;
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ result: true, err: err });
        }
    }
}));
