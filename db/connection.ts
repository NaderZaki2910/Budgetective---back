import * as sql from "mssql";
import * as dotenv from "dotenv";

dotenv.config();

const con: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST ?? "",
  port: Number(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 1500000,
  },
};

export const connect = async (
  username: string,
  password: string
): Promise<sql.ConnectionPool> => {
  if (!!username && !!password) {
    con.user = username;
    con.password = password;
  }
  return await sql.connect(con);
};
