import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
  title: string;
  description?: string;
  workingHoursPerDay: number;
  breakMinutesPerDay: number;
  hourlyRate?: number;
  owner: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    workingHoursPerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    breakMinutesPerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    hourlyRate: {
      type: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ProjectDocument>("Project", ProjectSchema);
