interface IRecord {
  propertyId: string;
  amount: number;
  date: Date;
}

export interface IRecordInputDTO {
  name: string;
  email: string;
  password: string;
}

interface RecordFilterParams {
  propertyId: string;
  fromDate: Date;
  toDate: Date;
}

export { IRecord, RecordFilterParams };