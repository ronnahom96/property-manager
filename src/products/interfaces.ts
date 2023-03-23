import { Polygon } from "geojson";
import { ConsumptionProtocol, Type } from "./models/Product";

interface ProductParams {
  id: string
};

interface IProduct {
  id: string;
  name?: string;
  description?: string;
  boundingPolygon: Polygon;
  consumptionLink: string;
  type: Type;
  consumptionProtocol: ConsumptionProtocol;
  bestResolution: number;
  minZoomLevel: number;
  maxZoomLevel: number;
};

export { IProduct, ProductParams };
