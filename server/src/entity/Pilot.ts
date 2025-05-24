import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Drone } from "./Drone";

@Entity({ name: "pilot" })
export class Pilot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", name: "last_name" })
  last_name!: string;

  @Column({ type: "text", name: "first_name" })
  first_name!: string;

  @Column({ type: "text", name: "middle_name", nullable: true })
  middle_name?: string;

  @Column({ type: "text", nullable: true })
  email?: string;

  @Column({ type: "text", nullable: true })
  phone?: string;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  // связь «один пилот — много дронов»
  @OneToMany(() => Drone, (drone) => drone.pilot)
  drones!: Drone[];
}
    