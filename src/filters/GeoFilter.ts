import { Polygon } from "geojson";
import { Operator } from "../common/interfaces";
import { ProductQueryBuilder } from "../products/types";
import { ProductFilter } from "./ProductFilter";

export class GeoFilter implements ProductFilter {
  public operator!: string;
  public field!: string;
  public value!: Polygon;
  private readonly geoFunc: string;

  public constructor(operator: string, field: string, value: Polygon) {
    this.operator = operator;
    this.field = field;
    this.value = value;
    this.geoFunc = this.fromOperatorToGeoFunc(operator);
  }

  public appendFilterForQuery(queryBuilder: ProductQueryBuilder): ProductQueryBuilder {
      queryBuilder.andWhere(`${this.geoFunc}(product.boundingPolygon, ST_GeomFromGeoJSON(:geoJson))`)
        .setParameter("geoJson", JSON.stringify(this.value));
    return queryBuilder;
  }

  private fromOperatorToGeoFunc(operator: string): string {
    const geoFuncs: Record<string, string> = {
      [Operator.CONTAINS]: 'ST_Contains', [Operator.INTERSECTS]: 'ST_Intersects', [Operator.WITHIN]: 'ST_Within'
    };

    return geoFuncs[operator];
  }
}