import httpStatus from 'http-status-codes';
import { FilterQuery, Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../common/appError";
import { EXPENSE, INCOME, NOT_FOUND, SERVICES } from "../../common/constants";
import { IRecord, IRecordInputDTO, RecordFilterParams } from "../interfaces";

@injectable()
export class RecordService {
    constructor(@inject(SERVICES.RECORD_MODEL) private recordModel: Model<IRecord>) { }

    async searchRecords(propertyId: string, filters: RecordFilterParams): Promise<IRecord[]> {
        const query: FilterQuery<RecordFilterParams> = this.recordModel.find({ propertyId });
        const filteredQuery = this.buildQueryFromFilters(filters, query);

        const records = await filteredQuery.exec();
        return records;
    }

    async createRecord(recordInput: IRecordInputDTO): Promise<IRecord> {
        const Record = new this.recordModel({ ...recordInput });
        return await Record.save();
    }

    async getPropertyBalance(propertyId: string): Promise<number> {
        const records = await this.recordModel.find({ propertyId }).exec();
        if (records.length === 0) {
            throw new AppError(NOT_FOUND, httpStatus.NOT_FOUND, true);
        }

        const balance = records.map(record => record.amount).reduce((acc, currVal) => acc + currVal);
        return balance;
    }

    async getMonthlyReport(propertyId: string, month: number, startingBalance: number): Promise<string[]> {
        const filterQuery = { propertyId, "$expr": { "$eq": [{ "$month": "$date" }, month] } };
        const records = await this.recordModel.find(filterQuery).sort({ date: 1 }).exec();

        const report = this.buildReport(records, startingBalance);
        return report;
    }

    private buildReport(records: IRecord[], startingBalance: number) {
        const report = [`Starting cash = ${startingBalance}`];
        let currentCash = startingBalance;

        for (let index = 0; index < records.length; index++) {
            const amount = records[index].amount;
            const type = amount >= 0 ? "income" : "expense";
            currentCash += amount;
            report.push(`Record ${index}=> type=${type}, amount=${amount}, ${currentCash}`);
        }

        report.push(`Ending cash = ${currentCash}`)
        return report;
    }

    private buildQueryFromFilters(filters: RecordFilterParams, query: FilterQuery<RecordFilterParams>) {
        const { type, fromDate, toDate, sort, page, limit } = filters;

        if (type) {
            if (type === INCOME) {
                query.where('amount').gt(0);
            } else if (type === EXPENSE) {
                query.where('amount').lt(0);
            }
        }

        if (fromDate) {
            query.where({ date: { $gte: fromDate } });
        }

        if (toDate) {
            query.where({ date: { $lte: toDate } });
        }

        if (sort) {
            const sortValue = sort === "asc" ? 1 : -1;
            query.sort({ date: sortValue });
        }

        if (page && limit) {
            query.skip((page - 1) * limit).limit(limit);
        }

        return query;
    }
}
