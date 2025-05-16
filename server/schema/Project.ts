import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  category: String,
  startDate: Date,
  endDate: Date,
  status: String,
  progress: Number
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
