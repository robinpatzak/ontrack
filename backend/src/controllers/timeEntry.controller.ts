import { Request, Response } from "express";
import Project from "../models/Project";
import TimeEntry from "../models/TimeEntry";
import { z } from "zod";

export const getTodayTimeEntry = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const project = await Project.findOne({ _id: projectId, owner: user._id });
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeEntry = await TimeEntry.findOne({
      user: user._id,
      project: projectId,
      date: today,
    });

    if (!timeEntry) {
      res.status(404).json({
        success: false,
        message: "No time entry found for today",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Time entry retrieved successfully",
      timeEntry: {
        ...timeEntry.toObject(),
        currentWorkTime: timeEntry.getCurrentWorkTime(),
        currentBreakTime: timeEntry.getCurrentBreakTime(),
      },
      project,
    });
  } catch (error) {
    console.error("Error in getTodayTimeEntry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const startWork = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let timeEntry = await TimeEntry.findOne({
      user: user._id,
      project: projectId,
      date: today,
    });

    if (!timeEntry) {
      timeEntry = new TimeEntry({
        user: user._id,
        project: projectId,
        date: today,
        totalWorkTime: 0,
        totalBreakTime: 0,
        isWorkActive: false,
        isBreakActive: false,
        workSessions: [],
        breakSessions: [],
      });
    }

    if (timeEntry.isBreakActive && timeEntry.breakStartedAt) {
      const breakDuration = Math.floor(
        (Date.now() - timeEntry.breakStartedAt.getTime()) / 1000
      );
      timeEntry.totalBreakTime += breakDuration;

      const lastBreakSession =
        timeEntry.breakSessions[timeEntry.breakSessions.length - 1];
      if (lastBreakSession && !lastBreakSession.endTime) {
        lastBreakSession.endTime = new Date();
        lastBreakSession.duration = breakDuration;
      }
    }

    timeEntry.isWorkActive = true;
    timeEntry.isBreakActive = false;
    timeEntry.workStartedAt = new Date();
    timeEntry.breakStartedAt = undefined;

    timeEntry.workSessions.push({
      startTime: new Date(),
    });

    await timeEntry.save();

    res.status(200).json({
      success: true,
      message: "Work timer started",
      timeEntry: {
        ...timeEntry.toObject(),
        currentWorkTime: timeEntry.getCurrentWorkTime(),
        currentBreakTime: timeEntry.getCurrentBreakTime(),
      },
    });
  } catch (error) {
    console.error("Error in startWork:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const startBreak = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeEntry = await TimeEntry.findOne({
      user: user._id,
      project: projectId,
      date: today,
    });

    if (!timeEntry) {
      res.status(404).json({
        success: false,
        message: "Time entry not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (timeEntry.isWorkActive && timeEntry.workStartedAt) {
      const workDuration = Math.floor(
        (Date.now() - timeEntry.workStartedAt.getTime()) / 1000
      );
      timeEntry.totalWorkTime += workDuration;

      const lastWorkSession =
        timeEntry.workSessions[timeEntry.workSessions.length - 1];
      if (lastWorkSession && !lastWorkSession.endTime) {
        lastWorkSession.endTime = new Date();
        lastWorkSession.duration = workDuration;
      }
    }

    timeEntry.isBreakActive = true;
    timeEntry.isWorkActive = false;
    timeEntry.breakStartedAt = new Date();
    timeEntry.workStartedAt = undefined;

    timeEntry.breakSessions.push({
      startTime: new Date(),
    });

    await timeEntry.save();

    res.status(200).json({
      success: true,
      message: "Break timer started",
      timeEntry: {
        ...timeEntry.toObject(),
        currentWorkTime: timeEntry.getCurrentWorkTime(),
        currentBreakTime: timeEntry.getCurrentBreakTime(),
      },
    });
  } catch (error) {
    console.error("Error in startBreak:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const stopTimers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeEntry = await TimeEntry.findOne({
      user: user._id,
      project: projectId,
      date: today,
    });

    if (!timeEntry) {
      res.status(404).json({
        success: false,
        message: "Time entry not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (timeEntry.isWorkActive && timeEntry.workStartedAt) {
      const workDuration = Math.floor(
        (Date.now() - timeEntry.workStartedAt.getTime()) / 1000
      );
      timeEntry.totalWorkTime += workDuration;

      const lastWorkSession =
        timeEntry.workSessions[timeEntry.workSessions.length - 1];
      if (lastWorkSession && !lastWorkSession.endTime) {
        lastWorkSession.endTime = new Date();
        lastWorkSession.duration = workDuration;
      }
    }

    if (timeEntry.isBreakActive && timeEntry.breakStartedAt) {
      const breakDuration = Math.floor(
        (Date.now() - timeEntry.breakStartedAt.getTime()) / 1000
      );
      timeEntry.totalBreakTime += breakDuration;

      const lastBreakSession =
        timeEntry.breakSessions[timeEntry.breakSessions.length - 1];
      if (lastBreakSession && !lastBreakSession.endTime) {
        lastBreakSession.endTime = new Date();
        lastBreakSession.duration = breakDuration;
      }
    }

    timeEntry.isWorkActive = false;
    timeEntry.isBreakActive = false;
    timeEntry.workStartedAt = undefined;
    timeEntry.breakStartedAt = undefined;

    await timeEntry.save();

    res.status(200).json({
      success: true,
      message: "All timers stopped",
      timeEntry: {
        ...timeEntry.toObject(),
        currentWorkTime: timeEntry.getCurrentWorkTime(),
        currentBreakTime: timeEntry.getCurrentBreakTime(),
      },
    });
  } catch (error) {
    console.error("Error in stopTimers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const getTimeEntries = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { startDate, endDate } = req.query;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const query: any = {
      user: user._id,
      project: projectId,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const timeEntries = await TimeEntry.find(query)
      .populate(
        "project",
        "title workingHoursPerDay breakMinutesPerDay hourlyRate"
      )
      .sort({ date: -1 });

    const entriesWithCurrentTimes = timeEntries.map((entry) => {
      const startTime = entry.workSessions?.[0]?.startTime;
      const endTime = [...entry.workSessions]
        .reverse()
        .find((session) => session.endTime)?.endTime;

      return {
        ...entry.toObject(),
        startTime,
        endTime,
        totalWorkTime: entry.totalWorkTime,
        totalBreakTime: entry.totalBreakTime,
        isWorkActive: entry.isWorkActive,
        isBreakActive: entry.isBreakActive,
        currentWorkTime: entry.getCurrentWorkTime(),
        currentBreakTime: entry.getCurrentBreakTime(),
      };
    });

    res.status(200).json({
      success: true,
      message: "Time entries retrieved successfully",
      timeEntries: entriesWithCurrentTimes,
    });
  } catch (error) {
    console.error("Error in getTimeEntries:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const resetTimers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeEntry = await TimeEntry.findOne({
      user: user._id,
      project: projectId,
      date: today,
    });

    if (!timeEntry) {
      res.status(404).json({
        success: false,
        message: "Time entry not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    timeEntry.totalWorkTime = 0;
    timeEntry.totalBreakTime = 0;
    timeEntry.isWorkActive = false;
    timeEntry.isBreakActive = false;
    timeEntry.workStartedAt = undefined;
    timeEntry.breakStartedAt = undefined;
    timeEntry.workSessions = [];
    timeEntry.breakSessions = [];

    await timeEntry.save();

    res.status(200).json({
      success: true,
      message: "Timers reset successfully",
      timeEntry: {
        ...timeEntry.toObject(),
        currentWorkTime: 0,
        currentBreakTime: 0,
      },
    });
  } catch (error) {
    console.error("Error in resetTimers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

const addTimeEntrySchema = z
  .object({
    date: z.string().refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, "Invalid date format"),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)"
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)"
      ),
    breakDuration: z.number().min(0, "Break duration must be positive"),
  })
  .refine((data) => {
    const start = new Date(`${data.date}T${data.startTime}`);
    const end = new Date(`${data.date}T${data.endTime}`);
    return end > start;
  }, "End time must be after start time");

export const addTimeEntry = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const validatedBody = addTimeEntrySchema.parse(req.body);
    const { date, startTime, endTime, breakDuration } = validatedBody;

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const totalWorkTime =
      Math.floor((end.getTime() - start.getTime()) / 1000) - breakDuration;

    const timeEntry = new TimeEntry({
      user: user._id,
      project: projectId,
      date: new Date(date),
      totalWorkTime,
      totalBreakTime: breakDuration,
      workSessions: [
        { startTime: start, endTime: end, duration: totalWorkTime },
      ],
      breakSessions:
        breakDuration > 0
          ? [{ startTime: start, duration: breakDuration }]
          : [],
    });

    await timeEntry.save();

    res.status(201).json({
      success: true,
      message: "Time entry created",
      timeEntry,
    });
  } catch (error) {
    console.error("Error creating time entry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
