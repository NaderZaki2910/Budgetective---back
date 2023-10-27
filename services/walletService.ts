import * as sql from "mssql";
import { User } from "../models/user.model";
import walletRepo from "../repositories/walletRepo";
import { resolve } from "path";
import * as _jsonwebtoken from "jsonwebtoken";
import Wallet from "../models/wallet.model";

const SECRET_KEY = "WHATAMIDOINGHERE";

interface IWalletService {
  addWallet(wallet: Wallet, token: string): Promise<any>;
  getWallets(token: string, page: number, pageSize: number): Promise<any>;
}

class WalletService implements IWalletService {
  async addWallet(wallet: Wallet, token: string): Promise<any> {
    return walletRepo.addWallet(wallet, token);
  }
  async getWallets(
    token: string,
    page: number,
    pageSize: number
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      var wallets: Wallet[] = [];
      await walletRepo.getWallets(token).then((result) => {
        wallets = result.recordset;
        var totalItems = wallets.length;
        console.log(page, pageSize, "parameters");
        console.log(wallets, "before paging");
        var totalPages = Math.ceil(wallets.length / pageSize);
        console.log(totalPages, "totalPages");
        if (totalPages == page && totalPages != 1) {
          var totElementsNotNeeded = (totalPages - 1) * pageSize;
          console.log(totElementsNotNeeded, "totElementsNotNeeded");
          wallets = wallets.splice(
            totElementsNotNeeded,
            wallets.length - totElementsNotNeeded
          );
        } else {
          if (page == 1) {
            wallets = wallets.splice(0, pageSize);
          } else {
            var totElementsNotNeeded = (page - 1) * pageSize;
            wallets = wallets.splice(totElementsNotNeeded, pageSize);
          }
        }
        resolve({ wallets: wallets, totalItems: totalItems });
      });
    });
  }
}

export default new WalletService();
