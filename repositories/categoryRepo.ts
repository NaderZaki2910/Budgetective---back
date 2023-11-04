import { connectWithToken } from "../db/connection";
import * as sql from "mssql";
import { User } from "../models/user.model";
import Category from "../models/category.model";
import * as _jsonwebtoken from "jsonwebtoken";
import tokenService from "../services/tokenService";

interface ICategoryRepository {
  addCategory(
    category: Category,
    token: string
  ): Promise<sql.IProcedureResult<number>>;
  getRootCategories(token: string): Promise<sql.IProcedureResult<Category>>;
  getChildCategories(
    token: string,
    parentId: number
  ): Promise<sql.IProcedureResult<Category>>;
  getAllCategories(token: string): Promise<sql.IProcedureResult<Category>>;
}

class CategoryRepository implements ICategoryRepository {
  async getRootCategories(
    token: string
  ): Promise<sql.IProcedureResult<Category>> {
    var pool = new sql.ConnectionPool("");
    await connectWithToken(token)
      .then((poolRes: sql.ConnectionPool) => {
        pool = poolRes;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return pool.request().execute<Category>("budg.get_root_categories");
  }
  async getChildCategories(
    token: string,
    parentId: number
  ): Promise<sql.IProcedureResult<Category>> {
    var pool = new sql.ConnectionPool("");
    await connectWithToken(token)
      .then((poolRes: sql.ConnectionPool) => {
        pool = poolRes;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return pool
      .request()
      .input("parent_id", sql.Int, parentId)
      .execute<Category>("budg.get_child_categories");
  }
  async getAllCategories(
    token: string
  ): Promise<sql.IProcedureResult<Category>> {
    var pool = new sql.ConnectionPool("");
    await connectWithToken(token)
      .then((poolRes: sql.ConnectionPool) => {
        pool = poolRes;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return pool.request().execute<Category>("budg.get_all_categories");
  }
  async addCategory(
    category: Category,
    token: string
  ): Promise<sql.IProcedureResult<number>> {
    var decodedToken = tokenService.decode(token.split(" ")[1]);
    var pool = new sql.ConnectionPool("");
    await connectWithToken(token)
      .then((poolRes: sql.ConnectionPool) => {
        pool = poolRes;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return pool
      .request()
      .input("name", sql.NVarChar(500), category.name)
      .input("child_of", sql.Int, category.child_of)
      .output("output", sql.Int)
      .execute<number>("budg.add_category");
  }
}

export default new CategoryRepository();
