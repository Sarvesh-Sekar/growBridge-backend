import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { encrypt } from "../helpers/helper";
import { Request, Response, NextFunction } from "express";
import { Session } from "../entity/Session";

export class AuthController {
  private static userRepo = AppDataSource.getRepository(User);
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, deviceName } = req.body;

      if (!email || !password || !deviceName) {
        res
          .status(400)
          .json({ message: "Email, Password and Device Name are required" });
        return;
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: "User Not Found" });
        return;
      }

      const isPasswordValid = await encrypt.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        res.status(401).json({ message: "Password is Incorrect" });
        return;
      }

      // Create and save session
      const sessionRepo = AppDataSource.getRepository(Session);
      const session = new Session();
      session.deviceName = deviceName;
      session.user = user;
      await sessionRepo.save(session);

      // Generate custom session token
      const token = encrypt.generateToken({
        sessionId: session.id,
        deviceName: session.deviceName,
        loginTime: session.loginTime,
      });

      res.status(200).json({ message: "Login Successful", user, token });
    } catch (error) {
      next(error); // delegate to error handler middleware
    }
  }

  static async getProfile(req: Request, res: Response): Promise<any> {
    console.log("sample");
    if (!req["currentUser" as keyof Request]) {
      console.log("sample");
      return res?.status(401)?.json({ message: "Unauthorized" });
    }

    try {
      const userRepo = AppDataSource.getRepository(User);
      console.log("sample");
      const user = userRepo.findOne({
        where: { id: req["currentUser" as keyof Request]?.id },
      });

      if (!user) return res?.status(404)?.json({ message: "User Not Found" });
      return res?.json({ ...user });
    } catch (error) {
      throw error;
    }
  }
}
