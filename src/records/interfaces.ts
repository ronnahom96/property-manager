import { RecordType, Sort } from "./types";

export interface IRecord {
  propertyId: string;
  prevPropertyValue: number;
  amount: number;
  date: Date;
}

export interface IRecordDTO {
  propertyId: string;
  amount: number;
  date: Date;
}

export interface RecordPathParams {
  propertyId: string;
}

export interface RecordFilterParams {
  type?: RecordType;
  fromDate?: Date;
  toDate?: Date;
  sort?: Sort;
  page?: number;
  limit?: number;
}

export interface MonthlyReportResponse {
  propertyId: string;
  month: number;
  report: string[];
}

export interface PropertyBalanceResponse {
  propertyId: string;
  balance: number;
}

export interface MonthlyReportQueryParams {
  year: number;
  month: number;
}

export interface Pagination {
  page: number;
  limit: number;
}