import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Drone } from './Drone';

@Entity()
export class FlightRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Drone, drone => drone.flightRequests, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'drone_id' })
  drone!: Drone;

  @Column({ type: 'jsonb' })
  route!: any;

  // ← вот тут
  @Column({ name: 'scheduled_at', type: 'timestamp' })
  scheduledAt!: Date;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
