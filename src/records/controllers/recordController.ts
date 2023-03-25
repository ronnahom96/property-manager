import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { IMonthlyReportResponse, IRecord, IRecordInputDTO, RecordFilterParams, RecordPathParams } from '../interfaces';
import { RecordService } from '../services/recordService';

type CreateResourceHandler = RequestHandler<undefined, IRecord, IRecordInputDTO>;
type GetResourceHandler = RequestHandler<undefined, IRecord[], RecordFilterParams>;
type GetPropertyBalanceHandler = RequestHandler<RecordPathParams, number, undefined>;
type GetMonthlyReportHandler = RequestHandler<RecordPathParams, IMonthlyReportResponse, undefined, { month: number }>;

@injectable()
export class RecordController {
  public constructor(@inject(RecordService) private readonly recordService: RecordService) { }

  public searchRecords: GetResourceHandler = (req, res, next) => {
    try {
      console.log(this.searchRecords);
      // const filters: RecordFilterParams = req.query;
      // const productList: Record[] = await this.manager.searchRecords(filters);
      // return res.status(httpStatus.OK).json(filters);
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
      return res.status(httpStatus.NO_CONTENT).send(balance);;
    } catch (error) {
      return next(error);
    }
  };

  public getMonthlyReport: GetMonthlyReportHandler = async (req, res, next) => {
    const propertyId: string = req.params.propertyId;
    const month: number = req.query.month;

    try {
      const report: string[] = await this.recordService.getMonthlyReport(propertyId, month);
      return res.status(httpStatus.NO_CONTENT).json({ propertyId, month, report });
    } catch (error) {
      return next(error);
    }
  };
}
