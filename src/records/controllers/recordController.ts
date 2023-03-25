import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { IRecord, IRecordInputDTO, MonthlyReportQueryParams, MonthlyReportResponse, PropertyBalanceResponse, RecordFilterParams, RecordPathParams } from '../interfaces';
import { RecordService } from '../services/recordService';

type CreateResourceHandler = RequestHandler<undefined, IRecord, IRecordInputDTO>;
type SearchRecordsHandler = RequestHandler<undefined, IRecord[], RecordFilterParams>;
type GetPropertyBalanceHandler = RequestHandler<RecordPathParams, PropertyBalanceResponse, undefined>;
type GetMonthlyReportHandler = RequestHandler<RecordPathParams, MonthlyReportResponse, undefined, MonthlyReportQueryParams>;

@injectable()
export class RecordController {
  public constructor(@inject(RecordService) private readonly recordService: RecordService) { }

  public searchRecords: SearchRecordsHandler = (req, res, next) => {
    try {
      // const filters: RecordFilterParams = req.query;
      // const productList: Record[] = await this.manager.searchRecords(filters);
      // const records: IRecord = [];
      return res.status(httpStatus.OK).json([]);
    } catch (error) {
      return next(error)
    }
  };

  public createRecord: CreateResourceHandler = async (req, res, next) => {
    try {
      const recordInput: IRecordInputDTO = req.body
      const record = await this.recordService.createRecord(recordInput);
      return res.status(httpStatus.CREATED).json(record);
    } catch (error) {
      return next(error);
    }
  };

  public getPropertyBalance: GetPropertyBalanceHandler = async (req, res, next) => {
    try {
      const propertyId = req.params.propertyId;
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
