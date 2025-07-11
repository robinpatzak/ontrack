import { Request, Response } from "express";
import Project from "../models/Project";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string(),
  description: z.string().default(""),
  workingHoursPerDay: z.number(),
  breakMinutesPerDay: z.number(),
  hourlyRate: z.number().optional(),
});

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const validatedBody = createProjectSchema.parse(req.body);
    const {
      title,
      description,
      workingHoursPerDay,
      breakMinutesPerDay,
      hourlyRate,
    } = validatedBody;

    const owner = (req as any).user._id;

    const project = await Project.create({
      title,
      description,
      workingHoursPerDay,
      breakMinutesPerDay,
      hourlyRate,
      owner,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create project",
      timestamp: new Date().toISOString(),
    });
  }
};

export const listProjectsController = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user._id;
    const projects = await Project.find({ owner });
    res.json({
      success: true,
      projects,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Faild to retrieve projects",
      timestamp: new Date().toISOString(),
    });
  }
};

export const getProjectController = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user._id;
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, owner });
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      project,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve project",
      timestamp: new Date().toISOString(),
    });
  }
};
