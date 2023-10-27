import { Router } from "express";
import loginService from "../services/loginService";
import { User } from "../models/user.model";
import { Md5 } from "ts-md5";

export const loginRoute = Router();

const saltRounds = 8;

loginRoute.post("/login", async (req, res) => {
  const user: User = {
    username: req.body.username,
    password: await Md5.hashStr(req.body.password),
  };
  try {
    var token;
    await loginService
      .login(user)
      .then((result) => {
        token = result ?? "0";
      })
      .catch((err) => {
        throw err;
      });
    if (!!token) {
      res.send(token);
    } else {
      throw new Error("Login Failed");
    }
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
});
