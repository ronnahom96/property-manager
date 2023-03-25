import httpStatus from 'http-status-codes';
import { FilterQuery, Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../common/appError";
import { EXPENSE, INCOME, NOT_FOUND, SERVICES } from "../../common/constants";
import { IRecord, IRecordDTO, RecordFilterParams } from "../interfaces";

@injectable()
export class RecordService {
    constructor(@inject(SERVICES.RECORD_MODEL) private recordModel: Model<IRecord>) { }

    async searchRecords(propertyId: string, filters: RecordFilterParams): Promise<IRecord[]> {
        const query: FilterQuery<RecordFilterParams> = this.recordModel.find({ propertyId });
        const filteredQuery = this.buildQueryFromFilters(filters, query);

        const records = await filteredQuery.exec();
        return records;
    }

    async createRecord(recordInput: IRecordDTO): Promise<IRecord> {
        const lastRecord = await this.fetchLastRecordByProperty(recordInput.propertyId);
        const balance = this.calcBalance(lastRecord, new Date(recordInput.date), recordInput.amount);
        const record = new this.recordModel({ balance, ...recordInput });
        return await record.save();
    }

    async getPropertyBalance(propertyId: string): Promise<number> {
        const lastRecord = await this.fetchLastRecordByProperty(propertyId);
        if (!lastRecord) {
            throw new AppError(NOT_FOUND, httpStatus.NOT_FOUND, true);
        }

        return lastRecord.balance;
    }

    async getMonthlyReport(propertyId: string, year: number, month: number): Promise<string[]> {
        const filterQuery = {
            propertyId,
            "$expr": {
                "$and": [
                    { "$eq": [{ "$month": "$date" }, month] },
                    { "$eq": [{ "$year": "$date" }, year] }
                ]
            }
        };
        const records = await this.recordModel.find(filterQuery).sort({ date: 1 }).exec();
        if (records.length === 0) {
            throw new AppError(NOT_FOUND, httpStatus.NOT_FOUND, true);
        }

        const startingBalance = records[0].balance - records[0].amount;
        const report = this.buildReport(records, startingBalance);
        return report;
    }

    private calcBalance(lastRecord: IRecord | null, date: Date, amount: number) {
        let balance = amount;

        if (lastRecord && lastRecord.date.getTime() < date.getTime()) {
            balance += lastRecord ? lastRecord.balance : 0;
        }

        return balance;
    }

    private async fetchLastRecordByProperty(propertyId: string): Promise<IRecord | null> {
        const record: IRecord | null = await this.recordModel.findOne({ propertyId }).sort({ date: -1 }).exec();
        return record;
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

    // TODO: improve it to be generic, explanation in the README
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
