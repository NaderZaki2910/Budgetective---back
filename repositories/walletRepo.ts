import { connectWithToken } from "../db/connection";
import * as sql from "mssql";
import { User } from "../models/user.model";
import { Wallet } from "../models/wallet.model";
import * as _jsonwebtoken from "jsonwebtoken";
import tokenService from "../services/tokenService";

interface IWalletRepository {
  addWallet(
    wallet: Wallet,
    token: string
  ): Promise<sql.IProcedureResult<number>>;
  getWallets(token: string): Promise<sql.IProcedureResult<Wallet>>;
}

class WalletRepository implements IWalletRepository {
  async getWallets(token: string): Promise<sql.IProcedureResult<Wallet>> {
    var pool = new sql.ConnectionPool("");
    await connectWithToken(token)
      .then((poolRes: sql.ConnectionPool) => {
        pool = poolRes;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return pool.request().execute<Wallet>("budg.get_user_wallets");
  }
  async addWallet(
    wallet: Wallet,
    token: string
  ): Promise<sql.IProcedureResult<number>> {
    var decodedToken = tokenService.decode(token.split(" ")[1]);
    var pool = new sql.ConnectionPool("");
    await connectWithToken(token)
      .then((poolRes: sql.ConnectionPool) => {
        pool = poolRes;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return pool
      .request()
      .input("name", sql.NVarChar(500), wallet.name)
      .input("description", sql.NVarChar(3000), wallet.description)
      .input("amount", sql.Money, wallet.amount)
      .output("output", sql.Int)
      .execute<number>("budg.add_wallet");
  }
}

export default new WalletRepository();
