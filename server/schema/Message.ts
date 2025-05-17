import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  userName: string;
  message: string;
  fromUserId: mongoose.Types.ObjectId;
  targetUserId?: mongoose.Types.ObjectId;
  isRead: boolean;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  userName: { type: String, required: true },
  message: { type: String, required: true },
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
  time: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);