import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { encrypt } from "../helpers/helper";
import * as cache from "memory-cache";
import{Request,Response,NextFunction} from "express";

export class UserController {
  private static userRepo = AppDataSource.getRepository(User);

  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password ,role} = req.body;
      
  
      if (!email || !password) {
        res.status(400).json({
          message: "Both Email and Password are required for SignUp",
        });
        return;
      }
  
      const hashPassword = await encrypt.encryptPassword(password);
  
      const user = new User();
      user.email = email;
      user.password = hashPassword;
      user.role = role;
      const userRepo = AppDataSource.getRepository(User);
  
      await userRepo.save(user);
  
      //const token = encrypt.generateToken({ id: user.id ,});
  
      res.status(200).json({ message: "User Created Successfully",user });
    } catch (error) {
      next(error); // use next for error handling middleware
    }
  }
  

  static async getUsers(req:Request, res:Response, next:NextFunction):Promise<any> {
    try {
      const data = cache?.get("data");
      if (data)
        return res
          ?.status(200)
          ?.json({ message: "User Data : " ,data});
      else {
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find();

        cache.put("data", users, 100);
        return res
          ?.status(200)
          ?.json({ message: "User Data : " ,users});
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(req:Request, res:Response, next:NextFunction):Promise<any> {
    try {
      const { id } = req?.params;
      const { email, password } = req?.body;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: {
          id,
        },
      });

      if (!user)
        return res
          ?.status(404)
          ?.json({ message: "User Not Found" });
      user.email = email;
      const hashPassword = await encrypt?.encryptPassword(password);
      user.password = hashPassword;

      await this.userRepo.save(user);
      return res?.status(200)?.json({ message: "Updated User" });
    } catch (error) {
      throw error;
    }
  }
  static async deleteUser(req:Request, res:Response, next:NextFunction):Promise<any> {
    try {
      const { id } = req?.params;
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({
        where: {
          id,
        },
      });

      if (!user)
        return res
          ?.status(404)
          ?.json({ message: "User Not Found" });

      await this.userRepo.remove(user);
      return res?.status(200)?.json({ message: "Removed User" });
    } catch (error) {
      throw error;
    }
  }
}
