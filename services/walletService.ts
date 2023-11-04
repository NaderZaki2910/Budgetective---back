import walletRepo from "../repositories/walletRepo";
import { Wallet, WalletStat } from "../models/wallet.model";
import pagingService from "./pagingService";

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
      await walletRepo.getWallets(token).then(async (result) => {
        wallets = result.recordset;
        await pagingService
          .pageArray(wallets, page, pageSize)
          .then((pagedResult) => {
            resolve({
              wallets: pagedResult.pagedArray,
              totalItems: pagedResult.totalItems,
            });
          });
      });
    });
  }
  async getWalletsStats(token: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      var wallets: Wallet[] = [];
      var walletStats: WalletStat[] = [];
      await walletRepo.getWallets(token).then((result) => {
        wallets = result.recordset;
        var walletsInDebt: Wallet[] = [],
          walletsNotInDebt: Wallet[] = [];
        var totOwned = 0,
          totOwed = 0;
        var walletStatsInDebt: WalletStat[] = [],
          walletStatsNotInDebt: WalletStat[] = [];
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
