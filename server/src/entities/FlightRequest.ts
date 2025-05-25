import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Drone } from "./Drone";

@Entity()
export class FlightRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  /* связь с дроном */
  @ManyToOne(() => Drone, (d) => d.flightRequests, { eager: true })
  @JoinColumn({ name: "drone_id" })     
  drone!: Drone;

  /* поля формы */
  @Column() name!: string;

  @Column({ name: "start_date", type: "date" })
  startDate!: string;

  @Column({ name: "end_date", type: "date" })
  endDate!: string;

  @Column({ name: "takeoff_time", type: "time" })
  takeoffTime!: string;

  @Column({ name: "landing_time", type: "time" })
  landingTime!: string;

  @Column({ name: "geom_type" })
  geomType!: string;

  @Column({ type: "jsonb" })
  route!: any;

  @Column({ name: "max_altitude" })
  maxAltitude!: number;

  @Column({ name: "min_altitude", default: 0 })
  minAltitude!: number;

  @Column({ name: "uav_type" })
  uavType!: string;

  @Column({ nullable: true })
  purpose?: string;

  @Column({ default: true })
  vlos!: boolean;

  @Column({ default: "pending" })
  status!: "pending" | "approved" | "rejected";

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}