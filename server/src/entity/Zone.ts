// server/src/entity/Zone.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Geometry } from "geojson";

@Entity()
export class Zone {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  name!: string;

  @Column("geometry", { spatialFeatureType: "Polygon", srid: 4326 })
  geom!: Geometry;
}
