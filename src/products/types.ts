import { SelectQueryBuilder } from "typeorm";
import { ProductFilter } from "../filters/ProductFilter";
import { Product } from "./models/Product";

export type ProductQueryBuilder = SelectQueryBuilder<Product>;
export type ProductFilterList = ProductFilter[];