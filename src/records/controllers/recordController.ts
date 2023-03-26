import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { Logger } from 'pino';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../common/appError';
import { isDateValid } from '../../common/dateUtils';
import { NOT_NEW_DATE, INVALID_DATE, SERVICES } from '../../common/constants';
import {
  IRecord, IRecordDTO, MonthlyReportQueryParams, MonthlyReportResponse,
  PropertyBalanceResponse, RecordFilterParams, RecordPathParams
} from '../interfaces';
import { RecordService } from '../services/recordService';

type CreateRecordHandler = RequestHandler<undefined, IRecord, IRecordDTO>;
type SearchRecordsHandler = RequestHandler<RecordPathParams, IRecord[], undefined, RecordFilterParams>;
type GetPropertyBalanceHandler = RequestHandler<RecordPathParams, PropertyBalanceResponse, undefined>;
type GetMonthlyReportHandler = RequestHandler<RecordPathParams, MonthlyReportResponse, undefined, MonthlyReportQueryParams>;

@injectable()
export class RecordController {
  public constructor(@inject(RecordService) private readonly recordService: RecordService,
    @inject(SERVICES.LOGGER) private readonly logger: Logger) { }

  public searchRecords: SearchRecordsHandler = async (req, res, next) => {
    const propertyId = req.params.propertyId;
    const filters: RecordFilterParams = req.query;

    this.logger.info({ message: "start searchRecords", propertyId, filters });

    try {
      if ((filters.toDate && !isDateValid(filters.toDate)) ||
        (filters.fromDate && !isDateValid(filters.fromDate))) {
        throw new AppError(INVALID_DATE, httpStatus.UNPROCESSABLE_ENTITY, true);
      }

      const records: IRecord[] = await this.recordService.searchRecords(propertyId, filters);
      this.logger.info({ message: "finish searchRecords", propertyId, filters, recordsCount: records.length });
      return res.status(httpStatus.OK).json(records);
    } catch (error) {
      return next(error)
    }
  };

  public createRecord: CreateRecordHandler = async (req, res, next) => {
    const recordInput: IRecordDTO = req.body
    this.logger.info({ message: "start createRecord", recordInput });

    try {
      if (!isDateValid(recordInput.date)) {
        throw new AppError(INVALID_DATE, httpStatus.UNPROCESSABLE_ENTITY, true);
      }

      const lastRecord = await this.recordService.fetchLastRecordByProperty(recordInput.propertyId);

      if (lastRecord && !this.isNewRecordHasNewDate(lastRecord, recordInput)) {
        throw new AppError(NOT_NEW_DATE, httpStatus.UNPROCESSABLE_ENTITY, true);
      }

      const previousBalance = lastRecord ? lastRecord?.balance : 0;
      const record = await this.recordService.createRecord(recordInput, previousBalance);
      this.logger.info({ message: "finish createRecord", record });
      return res.status(httpStatus.CREATED).json(record);
    } catch (error) {
      return next(error);
    }
  };

  public getPropertyBalance: GetPropertyBalanceHandler = async (req, res, next) => {
    const propertyId = req.params.propertyId;
    this.logger.info({ message: "start getPropertyBalance", propertyId });

    try {
      const balance = await this.recordService.getPropertyBalance(propertyId);
      this.logger.info({ message: "finish getPropertyBalance", balance });
      return res.status(httpStatus.OK).json({ propertyId, balance });;
    } catch (error) {
      return next(error);
    }
  };

  public getMonthlyReport: GetMonthlyReportHandler = async (req, res, next) => {
    const propertyId: string = req.params.propertyId;
    const { year, month } = req.query;
    this.logger.info({ message: "start getMonthlyReport", propertyId, year, month });

    try {
      const report: string[] = await this.recordService.getMonthlyReport(propertyId, year, month);
      this.logger.info({ message: "finish getMonthlyReport", propertyId, year, month, report });
      return res.status(httpStatus.OK).json({ propertyId, month, report });
    } catch (error) {
      return next(error);
    }
  };

  private isNewRecordHasNewDate(lastRecord: IRecord, newRecord: IRecordDTO) {
    return lastRecord.date.getTime() < new Date(newRecord.date).getTime();
  }
}
