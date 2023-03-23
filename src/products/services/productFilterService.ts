import { Polygon } from "geojson";
import httpStatus from 'http-status-codes';
import { singleton } from "tsyringe";
import { AppError } from "../../common/appError";
import { INVALID_FILTER_TYPE } from "../../common/constants";
import { Operator } from "../../common/interfaces";
import { CompareFilter } from "../../filters/CompareFilter";
import { GeoFilter } from "../../filters/GeoFilter";
import { NumericFilter } from "../../filters/NumericFilter";
import { ProductFilter } from "../../filters/ProductFilter";

@singleton()
export class ProductFilterService {
  public castFilter(filter: ProductFilter): NumericFilter | GeoFilter | CompareFilter {
    const { operator, field, value } = filter;
    if (this.isNumericFilter(filter)) {
      return new NumericFilter(operator, field, value as number);
    } else if (this.isCompareFilter(filter)) {
      return new CompareFilter(field, value as number | string);
    } else if (this.isGeoFilter(filter)) {
      return new GeoFilter(operator, field, value as Polygon);
    }

    throw new AppError(INVALID_FILTER_TYPE, httpStatus.UNPROCESSABLE_ENTITY, true);
  }

  private isNumericFilter({ operator }: ProductFilter): boolean {
    const numericFilterList = [Operator.GREATER, Operator.GREATER_EQUAL, Operator.LESS, Operator.LESS_EQUAL];
    return Object.values(numericFilterList).includes(operator as Operator);
  }

  private isCompareFilter({ operator }: ProductFilter): boolean {
    return operator === Operator.EQUAL.toString();
  }

  private isGeoFilter({ operator }: ProductFilter): boolean {
    const geoFilterList = [Operator.INTERSECTS, Operator.WITHIN, Operator.CONTAINS];
    return Object.values(geoFilterList).includes(operator as Operator);
  }
}