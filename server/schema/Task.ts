import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    projectId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    assignedTo: mongoose.Types.ObjectId;
    status: string;
    dueDate: Date;
}

const TaskSchema = new Schema<ITask>({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    name: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    status: String,
    dueDate: Date
});

export default mongoose.model<ITask>('Task', TaskSchema);
