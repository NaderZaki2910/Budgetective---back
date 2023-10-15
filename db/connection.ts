import mysql from "mysql2";
import dbConfig from "../config/db.config";

export default mysql.createConnection({
  host: dbConfig.HOST,
  database: dbConfig.DB,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
});
