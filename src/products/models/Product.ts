import { Polygon } from "geojson";
import { Column, Entity, PrimaryColumn } from "typeorm";

const PRODUCTS_TABLE_NAME = process.env.PRODUCT_TABLE_NAME;

export enum ConsumptionProtocol {
  WMS = "WMS",
  WMTS = "WMTS",
  XYZ = "XYZ",
  THREE_D_TILES = "3D_TILES"
}

export enum Type {
  RASTER = "RASTER",
  RASTERIZED_VECTOR = "RASTERIZED_VECTOR",
  THREE_D_TILES = "3D_TILES",
  QMESH = "QMESH"
}

@Entity(PRODUCTS_TABLE_NAME)
export class Product {
  @PrimaryColumn()
  public id!: string;

  @Column()
  public name!: string

  @Column("text")
  public description?: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon', 
    srid: 4326
  })
  public boundingPolygon!: Polygon;

  @Column("text")
  public consumptionLink!: string;

  @Column({ type: "enum", enum: Type })
  public type!: Type

  @Column({ type: "enum", enum: ConsumptionProtocol })
  public consumptionProtocol!: ConsumptionProtocol

  @Column("float")
  public bestResolution!: number

  @Column("int")
  public minZoomLevel!: number;

  @Column("int")
  public maxZoomLevel!: number;

  public constructor(id: string, name: string, description: string | undefined, boundingPolygon: Polygon,
    consumptionLink: string, type: Type, consumptionProtocol: ConsumptionProtocol, bestResolution: number,
    minZoomLevel: number, maxZoomLevel: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.boundingPolygon = boundingPolygon;
    this.consumptionLink = consumptionLink;
    this.type = type;
    this.consumptionProtocol = consumptionProtocol;
    this.bestResolution = bestResolution;
    this.minZoomLevel = minZoomLevel;
    this.maxZoomLevel = maxZoomLevel;
  }
}
