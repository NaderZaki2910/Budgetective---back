import { connect } from "../db/connection";
import * as sql from "mssql";
import { User } from "../models/user.model";

interface ILoginRepository {
  login(user: User): Promise<sql.IProcedureResult<string>>;
}

class LoginRepository implements ILoginRepository {
  async login(user: User): Promise<sql.IProcedureResult<string>> {
    var pool = new sql.ConnectionPool("");
    await connect(user.username, user.password)
      .then((poolRes: sql.ConnectionPool) => {
        pool = poolRes;
      })
      .catch((err) => {
        throw err;
      });
    return pool
      .request()
      .input("username", sql.NVarChar(256), user.username)
      .input("input_password", sql.NVarChar(256), user.password)
      .output("output", sql.NVarChar(256))
      .execute<string>("login.user_login");
  }
}

export default new LoginRepository();
