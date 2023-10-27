"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const connection_1 = require("../db/connection");
const sql = __importStar(require("mssql"));
const tokenService_1 = __importDefault(require("../services/tokenService"));
class WalletRepository {
    getWallets(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var pool = new sql.ConnectionPool("");
            yield (0, connection_1.connectWithToken)(token)
                .then((poolRes) => {
                pool = poolRes;
            })
                .catch((err) => {
                console.log(err);
                throw err;
            });
            return pool.request().execute("budg.get_user_wallets");
        });
    }
    addWallet(wallet, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var decodedToken = tokenService_1.default.decode(token.split(" ")[1]);
            var pool = new sql.ConnectionPool("");
            yield (0, connection_1.connectWithToken)(token)
                .then((poolRes) => {
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
                .execute("budg.add_wallet");
        });
    }
}
exports.default = new WalletRepository();
