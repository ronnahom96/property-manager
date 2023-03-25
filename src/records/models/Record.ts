import { model, Schema, Types } from 'mongoose';
import { IRecord } from '../interfaces';

const recordSchema = new Schema<IRecord>({
    propertyId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});

export default model<IRecord>('Record', recordSchema);

