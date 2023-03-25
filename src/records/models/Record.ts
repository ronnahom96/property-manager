import { model, Schema } from 'mongoose';
import { IRecord } from '../interfaces';

const recordSchema = new Schema<IRecord>({
    propertyId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});

// Create index for read performance
recordSchema.index({ propertyId: 1 });

export default model<IRecord>('Record', recordSchema);

