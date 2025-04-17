// Session.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "sessions" })
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  deviceName!: string;

  @CreateDateColumn()
  loginTime!: Date;

  @OneToOne(() => User, (user) => user.session)
  @JoinColumn()
  user!: User;
}
