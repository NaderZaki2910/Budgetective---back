import express from "express";
import { loginRoute } from "./loginController";
import { walletRoute } from "./walletController";

export const routes = express.Router();

// routes.use(defaultRoute);
routes.use("/user", loginRoute);
routes.use("/wallet", walletRoute);
