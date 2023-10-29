"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletRepo_1 = __importDefault(require("../repositories/walletRepo"));
const SECRET_KEY = "WHATAMIDOINGHERE";
class WalletService {
    addWallet(wallet, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return walletRepo_1.default.addWallet(wallet, token);
        });
    }
    getWallets(token, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var wallets = [];
                yield walletRepo_1.default.getWallets(token).then((result) => {
                    wallets = result.recordset;
                    var totalItems = wallets.length;
                    console.log(page, pageSize, "parameters");
                    console.log(wallets, "before paging");
                    var totalPages = Math.ceil(wallets.length / pageSize);
                    console.log(totalPages, "totalPages");
                    if (totalPages == page && totalPages != 1) {
                        var totElementsNotNeeded = (totalPages - 1) * pageSize;
                        console.log(totElementsNotNeeded, "totElementsNotNeeded");
                        wallets = wallets.splice(totElementsNotNeeded, wallets.length - totElementsNotNeeded);
                    }
                    else {
                        if (page == 1) {
                            wallets = wallets.splice(0, pageSize);
                        }
                        else {
                            var totElementsNotNeeded = (page - 1) * pageSize;
                            wallets = wallets.splice(totElementsNotNeeded, pageSize);
                        }
                    }
                    resolve({ wallets: wallets, totalItems: totalItems });
                });
            }));
        });
    }
    getWalletsStats(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var wallets = [];
                var walletStats = [];
                yield walletRepo_1.default.getWallets(token).then((result) => {
                    wallets = result.recordset;
                    var walletsInDebt = [];
                    var walletsNotInDebt = [];
                    var totOwned = 0;
                    var totOwed = 0;
                    var walletStatsInDebt = [];
                    var walletStatsNotInDebt = [];
                    wallets.map(function (val, index) {
                        if (val.amount >= 0) {
                            totOwned += val.amount;
                            walletsNotInDebt = walletsNotInDebt.concat(val);
                        }
                        else {
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
            }));
        });
    }
}
exports.default = new WalletService();
