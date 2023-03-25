import httpStatus from 'http-status-codes';
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../common/appError";
import { NOT_FOUND, SERVICES } from "../../common/constants";
import { IRecord, IRecordInputDTO } from "../interfaces";

@injectable()
export class RecordService {
    constructor(@inject(SERVICES.RECORD_MODEL) private recordModel: Model<IRecord>) { }

    async searchRecords(params: any): Promise<IRecord[]> {
        return [];
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
        const query = { propertyId, "$expr": { "$eq": [{ "$month": "$date" }, month] } };
        const records = await this.recordModel.find(query).sort({ date: 1 }).exec();

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
}