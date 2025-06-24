import mongoose, { Document, Schema } from "mongoose";

export interface TimeEntryDocument extends Document {
  project: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  date: Date;
  totalWorkTime: number;
  totalBreakTime: number;
  isWorkActive: boolean;
  isBreakActive: boolean;
  workStartedAt?: Date;
  breakStartedAt?: Date;
  workSessions: Array<{ startTime: Date; endTime?: Date; duration?: number }>;
  breakSessions: Array<{ startTime: Date; endTime?: Date; duration?: number }>;
  getCurrentWorkTime: () => number;
  getCurrentBreakTime: () => number;
}

const TimeEntrySchema = new Schema<TimeEntryDocument>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalWorkTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBreakTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    isWorkActive: {
      type: Boolean,
      default: false,
    },
    isBreakActive: {
      type: Boolean,
      default: false,
    },
    workStartedAt: {
      type: Date,
    },
    breakStartedAt: {
      type: Date,
    },
    workSessions: [
      {
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
        },
        duration: {
          type: Number,
        },
      },
    ],
    breakSessions: [
      {
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
        },
        duration: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

TimeEntrySchema.index({ user: 1, project: 1, date: 1 }, { unique: true });

TimeEntrySchema.methods.getCurrentWorkTime = function (): number {
  let currentTime = this.totalWorkTime;

  if (this.isWorkActive && this.workStartedAt) {
    const activeSeconds = Math.floor(
      (Date.now() - this.workStartedAt.getTime()) / 1000
    );
    currentTime += activeSeconds;
  }

  return currentTime;
};

TimeEntrySchema.methods.getCurrentBreakTime = function (): number {
  let currentTime = this.totalBreakTime;

  if (this.isBreakActive && this.breakStartedAt) {
    const activeSeconds = Math.floor(
      (Date.now() - this.breakStartedAt.getTime()) / 1000
    );
    currentTime += activeSeconds;
  }

  return currentTime;
};

export default mongoose.model<TimeEntryDocument>("TimeEntry", TimeEntrySchema);
