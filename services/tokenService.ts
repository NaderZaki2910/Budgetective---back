import * as sql from "mssql";
import { User, Token } from "../models/user.model";
import loginRepo from "../repositories/loginRepo";
import { resolve } from "path";
import * as _jsonwebtoken from "jsonwebtoken";
import * as CryptoJS from "crypto-js";

const SECRET_KEY = "WHYAREWESTILLHERE?";
const ENCRYPTION_KEY = "JUSTTOSUFFER?";
const IV = CryptoJS.enc.Utf8.parse("IWANTTODIETHISISNOTAJOKE");
interface ITokenService {
  encode(user: User): string;
  decode(token: string): User;
}

class TokenService implements ITokenService {
  key = "ciphertext" as keyof Object;
  encode(user: User): string {
    let ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      ENCRYPTION_KEY,
      {
        iv: IV,
      }
    ).toString();
    return _jsonwebtoken.sign({ ciphertext: ciphertext }, SECRET_KEY);
  }
  decode(token: string): any {
    var decoded = _jsonwebtoken.verify(token, SECRET_KEY);
    var ciphertext = decoded.valueOf()[this.key];
    let decryptedData = CryptoJS.AES.decrypt(
      ciphertext.toString(),
      ENCRYPTION_KEY,
      {
        iv: IV,
      }
    );
    return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
  }
}

export default new TokenService();
