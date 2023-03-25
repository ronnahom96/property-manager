import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import {
  IRecord, IRecordInputDTO, MonthlyReportQueryParams, MonthlyReportResponse,
  PropertyBalanceResponse, RecordFilterParams, RecordPathParams
} from '../interfaces';
import { RecordService } from '../services/recordService';

type CreateResourceHandler = RequestHandler<undefined, IRecord, IRecordInputDTO>;
type SearchRecordsHandler = RequestHandler<RecordPathParams, IRecord[], undefined, RecordFilterParams>;
type GetPropertyBalanceHandler = RequestHandler<RecordPathParams, PropertyBalanceResponse, undefined>;
type GetMonthlyReportHandler = RequestHandler<RecordPathParams, MonthlyReportResponse, undefined, MonthlyReportQueryParams>;

@injectable()
export class RecordController {
  public constructor(@inject(RecordService) private readonly recordService: RecordService) { }

  public searchRecords: SearchRecordsHandler = async (req, res, next) => {
    const propertyId = req.params.propertyId;
    const filters: RecordFilterParams = req.query;
    try {
      const records: IRecord[] = await this.recordService.searchRecords(propertyId, filters);
      return res.status(httpStatus.OK).json(records);
    } catch (error) {
      return next(error)
    }
  };

  public createRecord: CreateResourceHandler = async (req, res, next) => {
    const recordInput: IRecordInputDTO = req.body
    try {
      const record = await this.recordService.createRecord(recordInput);
      return res.status(httpStatus.CREATED).json(record);
    } catch (error) {
      return next(error);
    }
  };

  public getPropertyBalance: GetPropertyBalanceHandler = async (req, res, next) => {
    const propertyId = req.params.propertyId;
    try {
      const balance = await this.recordService.getPropertyBalance(propertyId);
      return res.status(httpStatus.OK).json({ propertyId, balance });;
    } catch (error) {
      return next(error);
    }
  };

  public getMonthlyReport: GetMonthlyReportHandler = async (req, res, next) => {
    const propertyId: string = req.params.propertyId;
    const { month, startingBalance } = req.query;

    try {
      const report: string[] = await this.recordService.getMonthlyReport(propertyId, month, Number(startingBalance));
      return res.status(httpStatus.OK).json({ propertyId, month, report });
    } catch (error) {
      return next(error);
    }
  };
}
