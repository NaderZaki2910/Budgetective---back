import connection from "../db/connection";
import User from "../models/user.model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface ILoginRepository {
  login(user: User): Promise<number>;
}

class LoginRepository implements ILoginRepository {
  login(user: User): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.execute<RowDataPacket[]>(
        "login.user_login @username=?,@password=?",
        [user.username, user.password],
        (err, res) => {
          if (err) reject(err);
          else resolve(parseInt(res[0].toString()));
        }
      );
    });
  }
}

export default new LoginRepository();
