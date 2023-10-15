import express from "express";
import { defaultRoute } from "./test";
import { loginRoute } from "./loginController";

export const routes = express.Router();

// routes.use(defaultRoute);
routes.use(loginRoute);
