import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Pilot } from "./Pilot";

@Entity({ name: "drone" })
export class Drone {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  brand!: string;

  @Column({ type: "text" })
  model!: string;

  @Column({ type: "text", unique: true })
  serial_number!: string;

  @ManyToOne(() => Pilot, pilot => pilot.drones, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "pilot_id" })
  pilot!: Pilot;
}
