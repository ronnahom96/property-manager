import { Polygon } from "geojson";
import { ProductQueryBuilder } from "../products/types";

export interface ProductFilter {
  operator: string
  field: string;
  value: number | string | Polygon;

  appendFilterForQuery: (queryBuilder: ProductQueryBuilder) => ProductQueryBuilder;
}