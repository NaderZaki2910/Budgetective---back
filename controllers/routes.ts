import express from "express";
import { loginRoute } from "./loginController";
import { walletRoute } from "./walletController";
import { categoryRoute } from "./categoryController";

export const routes = express.Router();

// routes.use(defaultRoute);
routes.use("/user", loginRoute);
routes.use("/wallet", walletRoute);
routes.use("/category", categoryRoute);
