import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { SERVICES } from "../../common/constants";
import { IRecord, IRecordInputDTO } from "../interfaces";

@injectable()
export class RecordService {
    constructor(@inject(SERVICES.RECORD_MODEL) private recordModel: Model<IRecord>) { }

    async createRecord(recordInput: IRecordInputDTO): Promise<IRecord> {
        const Record = new this.recordModel({ ...recordInput });
        return await Record.save();
    }

    async getPropertyBalance(propertyId: string): Promise<number> {
        const records = await this.recordModel.find({ propertyId }).exec();
        // ?records.map(record => record.amount);
        return 1;
    }
}