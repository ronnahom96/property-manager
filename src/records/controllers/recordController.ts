import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { IRecord, IRecordInputDTO, RecordFilterParams } from '../interfaces';
import { RecordService } from '../services/recordService';

type CreateResourceHandler = RequestHandler<undefined, IRecord, IRecordInputDTO>;
type GetResourceHandler = RequestHandler<undefined, IRecord[], RecordFilterParams>;
type GetMonthlyReportHandler = RequestHandler<undefined, string, { propertyId: string, month: number }>;
type GetPropertyBalanceHandler = RequestHandler<{ propertyId: string }, number, undefined>;

@injectable()
export class RecordController {
  public constructor(@inject(RecordService) private readonly recordService: RecordService) { }

  public searchRecords: GetResourceHandler = (req, res, next) => {
    try {
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

  public getMonthlyReport: GetMonthlyReportHandler = (req, res, next) => {
    try {
      const propertyId: any = req.query.propertyId;
      const month: any = req.query.month;
      return res.status(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  };
}
