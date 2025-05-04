import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    students: mongoose.Types.ObjectId[];
    category: string;
    startDate: Date;
    endDate: Date;
    status: string;
    progress: number;
}

const ProjectSchema = new Schema<IProject>({
    title: String,
    description: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    category: String,
    startDate: Date,
    endDate: Date,
    status: String,
    progress: Number
});

export default mongoose.model<IProject>('Project', ProjectSchema);
