import * as sql from "mssql";
import { User } from "../models/user.model";
import walletRepo from "../repositories/walletRepo";
import { resolve } from "path";
import * as _jsonwebtoken from "jsonwebtoken";
import { Wallet, WalletStat } from "../models/wallet.model";

const SECRET_KEY = "WHATAMIDOINGHERE";

interface IWalletService {
  addWallet(wallet: Wallet, token: string): Promise<any>;
  getWallets(token: string, page: number, pageSize: number): Promise<any>;
  getWalletsStats(token: string): Promise<any>;
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
  async getWalletsStats(token: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      var wallets: Wallet[] = [];
      var walletStats: WalletStat[] = [];
      await walletRepo.getWallets(token).then((result) => {
        wallets = result.recordset;
        var walletsInDebt: Wallet[] = [];
        var walletsNotInDebt: Wallet[] = [];
        var totOwned = 0;
        var totOwed = 0;
        var walletStatsInDebt: WalletStat[] = [];
        var walletStatsNotInDebt: WalletStat[] = [];
        wallets.map(function (val, index) {
          if (val.amount >= 0) {
            totOwned += val.amount;
            walletsNotInDebt = walletsNotInDebt.concat(val);
          } else {
            totOwed += val.amount;
            walletsInDebt = walletsInDebt.concat(val);
          }
        });
        walletsNotInDebt.map(function (val, index) {
          if (!!val.id) {
            walletStatsNotInDebt = walletStatsNotInDebt.concat({
              id: val.id,
              name: val.name,
              percentage: val.amount / totOwned,
            });
          }
        });
        walletsInDebt.map(function (val, index) {
          if (!!val.id) {
            walletStatsInDebt = walletStatsInDebt.concat({
              id: val.id,
              name: val.name,
              percentage: val.amount / totOwed,
            });
          }
        });
        resolve({
          walletsInDebt: walletStatsInDebt,
          walletsNotInDebt: walletStatsNotInDebt,
          totalOwed: totOwed,
          totalOwned: totOwned,
        });
      });
    });
  }
}

export default new WalletService();
