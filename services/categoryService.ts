import categoryRepo from "../repositories/categoryRepo";
import * as _jsonwebtoken from "jsonwebtoken";
import Category from "../models/category.model";
import pagingService from "./pagingService";

interface ICategoryService {
  addCategory(category: Category, token: string): Promise<any>;
  getCategories(
    token: string,
    page: number,
    pageSize: number,
    getRoot: boolean,
    parentId?: number
  ): Promise<any>;
}

class CategoryService implements ICategoryService {
  async addCategory(category: Category, token: string): Promise<any> {
    return categoryRepo.addCategory(category, token);
  }
  async getCategories(
    token: string,
    page: number,
    pageSize: number,
    getRoot: boolean,
    parentId?: number
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      var categories: Category[] = [];
      if (getRoot) {
        await categoryRepo.getRootCategories(token).then(async (result) => {
          categories = result.recordset;
          await pagingService
            .pageArray(categories, page, pageSize)
            .then((pagedResult) => {
              resolve({
                categories: pagedResult.pagedArray,
                totalItems: pagedResult.totalItems,
              });
            });
        });
      } else {
        if (!!parentId) {
          await categoryRepo
            .getChildCategories(token, parentId)
            .then(async (result) => {
              categories = result.recordset;
              await pagingService
                .pageArray(categories, page, pageSize)
                .then((pagedResult) => {
                  resolve({
                    categories: pagedResult.pagedArray,
                    totalItems: pagedResult.totalItems,
                  });
                });
            });
        } else {
          await categoryRepo.getAllCategories(token).then(async (result) => {
            categories = result.recordset;
            resolve({
              categories: categories,
            });
          });
        }
      }
    });
  }
}

export default new CategoryService();
