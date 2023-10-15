"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../db/connection"));
class LoginRepository {
    login(user) {
        return new Promise((resolve, reject) => {
            connection_1.default.execute("login.user_login @username=?,@password=?", [user.username, user.password], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(parseInt(res[0].toString()));
            });
        });
    }
}
exports.default = new LoginRepository();
