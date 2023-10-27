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
const loginRepo_1 = __importDefault(require("../repositories/loginRepo"));
const tokenService_1 = __importDefault(require("./tokenService"));
const SECRET_KEY = "WHATAMIDOINGHERE";
class LoginService {
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var output = "";
            var token = "";
            yield loginRepo_1.default
                .login(user)
                .then((result) => {
                output = result.output["output"];
            })
                .catch((err) => {
                throw err;
            });
            if (output == user.password)
                token = tokenService_1.default.encode(user);
            return { user: user.username, token: token };
        });
    }
}
exports.default = new LoginService();
