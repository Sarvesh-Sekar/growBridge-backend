import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

type SessionPayload = {
  sessionId: string;
  deviceName: string;
  loginTime: Date;
};

dotenv.config();

const { JWT_SECRET = "hi" } = process.env;

export class encrypt {
  static async encryptPassword(password: string) {
    return bcrypt?.hashSync(password, 12);
  }

  static async comparePassword(hashPassword: string, password: string) {
    return bcrypt?.compareSync(hashPassword, password);
  }

  static generateToken(payload: SessionPayload): string {
    return `${payload.sessionId}|${
      payload.deviceName
    }|${payload.loginTime.toISOString()}`;
  }
}
