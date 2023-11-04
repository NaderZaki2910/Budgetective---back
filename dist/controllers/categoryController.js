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
exports.categoryRoute = void 0;
const express_1 = require("express");
const categoryService_1 = __importDefault(require("../services/categoryService"));
exports.categoryRoute = (0, express_1.Router)();
exports.categoryRoute.post("/addCategory", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.status(401).send();
    }
    else {
        console.log(req.body);
        const category = {
            name: req.body.name,
            child_of: req.body.child_of,
        };
        const token = req.headers.authorization;
        try {
            var result;
            yield categoryService_1.default
                .addCategory(category, token)
                .then((result) => {
                console.log(result.output["output"]);
                if (!result.output["output"] || result.output["output"] == 0) {
                    throw new Error("Failed to add category");
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
exports.categoryRoute.get("/getCategories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.status(401).send();
    }
    else {
        const token = req.headers.authorization;
        const { query } = req;
        const page = query.page;
        const pageSize = query.pageSize;
        const getRoot = query.getRoot;
        const parentId = query.parentId;
        if (!!page &&
            !!pageSize &&
            !!getRoot &&
            typeof page === "string" &&
            typeof pageSize === "string" &&
            typeof getRoot === "string") {
            try {
                console.log(parentId);
                yield categoryService_1.default
                    .getCategories(token, parseInt(page), parseInt(pageSize), getRoot == "true", !!parentId && typeof parentId === "string"
                    ? parseInt(parentId)
                    : undefined)
                    .then((result) => {
                    if (!result) {
                        throw new Error("Failed to get category");
                    }
                    else {
                        res.send(result);
                    }
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
