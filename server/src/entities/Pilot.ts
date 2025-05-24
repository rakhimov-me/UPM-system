import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany         
} from 'typeorm'
import { Drone } from './Drone'  

@Entity()
export class Pilot {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  last_name!: string

  @Column()
  first_name!: string

  @Column({ nullable: true })
  middle_name?: string

  @Column({ unique: true })
  email!: string

  @Column({ unique: true, nullable: true })
  phone?: string

  @Column()
  password_hash!: string

  @Column({ default: true })
  is_active!: boolean

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @OneToMany(() => Drone, drone => drone.pilot)
  drones!: Drone[]
}
