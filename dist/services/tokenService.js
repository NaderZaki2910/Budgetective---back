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
Object.defineProperty(exports, "__esModule", { value: true });
const _jsonwebtoken = __importStar(require("jsonwebtoken"));
const CryptoJS = __importStar(require("crypto-js"));
const SECRET_KEY = "WHYAREWESTILLHERE?";
const ENCRYPTION_KEY = "JUSTTOSUFFER?";
const IV = CryptoJS.enc.Utf8.parse("IWANTTODIETHISISNOTAJOKE");
class TokenService {
    constructor() {
        this.key = "ciphertext";
    }
    encode(user) {
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(user), ENCRYPTION_KEY, {
            iv: IV,
        }).toString();
        return _jsonwebtoken.sign({ ciphertext: ciphertext }, SECRET_KEY);
    }
    decode(token) {
        var decoded = _jsonwebtoken.verify(token, SECRET_KEY);
        var ciphertext = decoded.valueOf()[this.key];
        let decryptedData = CryptoJS.AES.decrypt(ciphertext.toString(), ENCRYPTION_KEY, {
            iv: IV,
        });
        return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
    }
}
exports.default = new TokenService();
