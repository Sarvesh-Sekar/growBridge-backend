import { DataSource } from "typeorm";
import "reflect-metadata";
import { User } from "./entity/User";
import{Session} from "./entity/Session"
import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "localhost",
  port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
  username: DB_USERNAME || "postgres",
  password: DB_PASSWORD || "sarvesh@110304",
  database: DB_DATABASE || "gB",
  synchronize: true,
  logging: false,
  entities: [User,Session],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
