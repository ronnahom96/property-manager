export interface IRecord {
  propertyId: string;
  amount: number;
  date: Date;
}

export interface IRecordInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface RecordPathParams {
  propertyId: string;
}

export interface RecordFilterParams {
  propertyId: string;
  fromDate: Date;
  toDate: Date;
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
  month: number;
  startingBalance: number;
}