import { Operator } from "../common/interfaces";
import { ProductQueryBuilder } from "../products/types";
import { ProductFilter } from "./ProductFilter";

export class NumericFilter implements ProductFilter{
  public operator!: string;
  public field!: string;
  public value!: number;
  
  public constructor(operator: string, field: string, value: number) {
    this.operator = operator;
    this.field = field;
    this.value = value;
  }

  public appendFilterForQuery(queryBuilder: ProductQueryBuilder): ProductQueryBuilder {
    const symbolOperator: string = this.extractSymbolOperator(this.operator);
    return queryBuilder.andWhere(`product.${this.field} ${symbolOperator} :${this.field}`, { [this.field]: this.value })
  }

  private extractSymbolOperator(operator: string): string {
    const symbols: Record<string, string> = {
      [Operator.GREATER]: '>', [Operator.GREATER_EQUAL]: '>=', [Operator.LESS]: '<',
      [Operator.LESS_EQUAL]: '<=', [Operator.GREATER]: '>'
    };

    return symbols[operator];
  }
}