import express, { Express, Request, Response } from "express";
import { routes } from "./controllers/routes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const frontendUrl = !!process.env.FRONTEND;
const allowedOrigins = [frontendUrl];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, authorization",
};

app.use(cors(options));
app.use(express.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
