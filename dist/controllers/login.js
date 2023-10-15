"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoute = void 0;
const express_1 = require("express");
exports.loginRoute = (0, express_1.Router)();
exports.loginRoute.post("/login", (req, res) => {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    res.send(`username:${username}, password:${password}`);
});
