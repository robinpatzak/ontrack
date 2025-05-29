import { Request, Response } from "express";
import Project from "../models/Project";

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      workingHoursPerDay,
      breakMinutesPerDay,
      hourlyRate,
    } = req.body;

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
