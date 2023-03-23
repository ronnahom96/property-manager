import { Operator } from "../common/interfaces";
import { ProductQueryBuilder } from "../products/types";
import { ProductFilter } from "./ProductFilter";

export class CompareFilter implements ProductFilter{
  public field!: string;
  public operator!: string;
  public value!: number | string;
  
  public constructor(field: string, value: number | string) {
    this.operator = Operator.EQUAL;
    this.field = field;
    this.value = value;
  }

  public appendFilterForQuery(queryBuilder: ProductQueryBuilder): ProductQueryBuilder {
    return queryBuilder.andWhere(`product.${this.field} =:${this.field}`, { [this.field]: this.value })
  }
}