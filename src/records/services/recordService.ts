import httpStatus from 'http-status-codes';
import { FilterQuery, Model } from "mongoose";
import { inject, singleton } from "tsyringe";
import { AppError } from "../../common/appError";
import { EXPENSE, INCOME, NOT_FOUND, SERVICES } from "../../common/constants";
import { IRecord, IRecordDTO, RecordFilterParams } from "../interfaces";

@singleton()
export class RecordService {
    private readonly propertyBalance: Map<string, number>;
    private readonly monthlyReports: Map<string, string[]>;

    constructor(@inject(SERVICES.RECORD_MODEL) private recordModel: Model<IRecord>) {
        this.propertyBalance = new Map<string, number>();
        this.monthlyReports = new Map<string, string[]>();
    }

    async searchRecords(propertyId: string, filters: RecordFilterParams): Promise<IRecord[]> {
        const query: FilterQuery<RecordFilterParams> = this.recordModel.find({ propertyId });
        const filteredQuery = this.buildQueryFromFilters(filters, query);

        const records = await filteredQuery.exec();
        return records;
    }

    async createRecord(recordInput: IRecordDTO, previousBalance: number): Promise<IRecord> {
        const record = new this.recordModel({ balance: previousBalance + recordInput.amount, ...recordInput });
        this.propertyBalance.set(record.propertyId, record.balance);
        return await record.save();
    }

    async getPropertyBalance(propertyId: string): Promise<number> {
        let cacheBalance = this.propertyBalance.get(propertyId);
        if (cacheBalance) return cacheBalance;

        const lastRecord = await this.fetchLastRecordByProperty(propertyId);
        if (!lastRecord) {
            throw new AppError(NOT_FOUND, httpStatus.NOT_FOUND, true);
        }

        this.propertyBalance.set(lastRecord.propertyId, lastRecord.balance);
        return lastRecord.balance;
    }

    async getMonthlyReport(propertyId: string, year: number, month: number): Promise<string[]> {
        const reportMapKey = `${propertyId}_${month}_${year}`;
        const cacheReport = this.monthlyReports.get(reportMapKey);
        if (cacheReport) return cacheReport;

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
        this.monthlyReports.set(reportMapKey, report);
        return report;
    }

    public async fetchLastRecordByProperty(propertyId: string): Promise<IRecord | null> {
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
