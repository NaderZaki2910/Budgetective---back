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
const categoryRepo_1 = __importDefault(require("../repositories/categoryRepo"));
const pagingService_1 = __importDefault(require("./pagingService"));
class CategoryService {
    addCategory(category, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return categoryRepo_1.default.addCategory(category, token);
        });
    }
    getCategories(token, page, pageSize, getRoot, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var categories = [];
                if (getRoot) {
                    yield categoryRepo_1.default.getRootCategories(token).then((result) => __awaiter(this, void 0, void 0, function* () {
                        categories = result.recordset;
                        yield pagingService_1.default
                            .pageArray(categories, page, pageSize)
                            .then((pagedResult) => {
                            resolve({
                                categories: pagedResult.pagedArray,
                                totalItems: pagedResult.totalItems,
                            });
                        });
                    }));
                }
                else {
                    if (!!parentId) {
                        yield categoryRepo_1.default
                            .getChildCategories(token, parentId)
                            .then((result) => __awaiter(this, void 0, void 0, function* () {
                            categories = result.recordset;
                            yield pagingService_1.default
                                .pageArray(categories, page, pageSize)
                                .then((pagedResult) => {
                                resolve({
                                    categories: pagedResult.pagedArray,
                                    totalItems: pagedResult.totalItems,
                                });
                            });
                        }));
                    }
                    else {
                        yield categoryRepo_1.default.getAllCategories(token).then((result) => __awaiter(this, void 0, void 0, function* () {
                            categories = result.recordset;
                            resolve({
                                categories: categories,
                            });
                        }));
                    }
                }
            }));
        });
    }
}
exports.default = new CategoryService();
