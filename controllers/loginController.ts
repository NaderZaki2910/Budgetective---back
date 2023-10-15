import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../config/db.config";
import loginRepo from "../repositories/loginRepo";
import User from "../models/user.model";

export const loginRoute = Router();

loginRoute.post("/login", (req, res) => {
  console.log(req.body);
  var username: string = req.body.username;
  var password: string = req.body.password;
  const user: User = {
    username: username,
    password: password,
  };
  loginRepo.login(user);
  res.send(`username:${username}, password:${password}`);
});
