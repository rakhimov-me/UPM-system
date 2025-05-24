import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Drone } from "./Drone";

@Entity({ name: "flight_request" })
export class FlightRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Drone, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "drone_id" })
  drone!: Drone;

  @Column({ type: "jsonb" })
  route!: any; // GeoJSON FeatureCollection

  @Column({ type: "timestamp without time zone" })
  scheduled_at!: Date;

  @Column({ type: "text", default: "pending" })
  status!: string;
}
