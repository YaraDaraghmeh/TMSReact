import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
    name: string;
}

const StudentSchema = new Schema<IStudent>({
    name: { type: String, required: true }
});

export default mongoose.model<IStudent>('Student', StudentSchema);
