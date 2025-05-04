import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    name: string;
    role: 'Administrator' | 'Student';
    studentId?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Administrator', 'Student'], required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
});

export default mongoose.model<IUser>('User', UserSchema);
