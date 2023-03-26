import { model, Schema } from 'mongoose';
import { IRecord } from '../interfaces';

const recordSchema = new Schema<IRecord>({
    // We don't need to add here our own id because mongoDB have auto generated _id for every document
    propertyId: { type: String, required: true },
    balance: { type: Number },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});

// Create index for read performance
recordSchema.index({ propertyId: 1, date: -1 });

export default model<IRecord>('Record', recordSchema);

