// src/config/db.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Zone } from "../entities/Zone";
import { Pilot } from "../entities/Pilot";
import { Drone } from "../entities/Drone";
import { FlightRequest } from "../entities/FlightRequest";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [Zone, Pilot, Drone, FlightRequest],
});
