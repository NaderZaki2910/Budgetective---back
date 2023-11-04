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
Object.defineProperty(exports, "__esModule", { value: true });
class PagingService {
    pageArray(array, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var totalItems = array.length;
                var totalPages = Math.ceil(array.length / pageSize);
                if (totalPages == page && totalPages != 1) {
                    var totElementsNotNeeded = (totalPages - 1) * pageSize;
                    array = array.splice(totElementsNotNeeded, array.length - totElementsNotNeeded);
                }
                else {
                    if (page == 1) {
                        array = array.splice(0, pageSize);
                    }
                    else {
                        var totElementsNotNeeded = (page - 1) * pageSize;
                        array = array.splice(totElementsNotNeeded, pageSize);
                    }
                }
                resolve({ pagedArray: array, totalItems: totalItems });
            });
        });
    }
}
exports.default = new PagingService();
