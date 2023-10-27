import * as sql from "mssql";
import { User } from "../models/user.model";
import loginRepo from "../repositories/loginRepo";
import tokenService from "./tokenService";
import { resolve } from "path";
import * as _jsonwebtoken from "jsonwebtoken";

const SECRET_KEY = "WHATAMIDOINGHERE";

interface ILoginService {
  login(user: User): Promise<number>;
}

class LoginService implements ILoginService {
  async login(user: User): Promise<any> {
    var output = "";
    var token = "";
    await loginRepo
      .login(user)
      .then((result) => {
        output = result.output["output"];
      })
      .catch((err) => {
        throw err;
      });
    if (output == user.password) token = tokenService.encode(user);
    return { user: user.username, token: token };
  }
}

export default new LoginService();
