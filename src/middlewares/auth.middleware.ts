import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Request, Response, NextFunction } from "express";
import { Session } from "../entity/Session";

dotenv.config();
interface RequestWithCurrentUser extends Request {
  currentUser: any;
}

export const authentification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const token = header.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Unauthorized - Token missing" });

    // Extract info from custom token
    const [sessionId, deviceName, loginTime] = token.split("|");
    if (!sessionId || !deviceName || !loginTime)
      return res
        .status(401)
        .json({ message: "Unauthorized - Malformed session token" });

    const sessionRepo = AppDataSource.getRepository(Session);
    const session = await sessionRepo.findOne({
      where: { id: sessionId },
      relations: ["user"],
    });

    if (!session)
      return res
        .status(401)
        .json({ message: "Unauthorized - Session not found" });

    if (
      session.deviceName !== deviceName ||
      session.loginTime.toISOString() !== loginTime
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Session mismatch" });
    }

    // Attach user info to request
    (req as any).currentUser = session.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid session" });
  }
};

export const authorization = (roles: string[]) => {
  return (
    req: RequestWithCurrentUser,
    res: Response,
    next: NextFunction
  ): void => {
    (async () => {
      try {
        const currentUserId = req.currentUser?.id;
        if (!currentUserId) {
          res.status(403).json({ message: "Forbidden" });
          return;
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: currentUserId } });

        if (!user || !roles.includes(user.role)) {
          res.status(403).json({ message: "Forbidden" });
          return;
        }

        next();
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })();
  };
};
