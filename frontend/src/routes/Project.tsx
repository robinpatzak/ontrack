import Timer from "@/components/Timer";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function ProjectRoute() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<{
    title: string;
    description: string;
    workingHoursPerDay: number;
    breakMinutesPerDay: number;
    hourlyRate: number;
  } | null>(null);

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await apiClient.get(`/project/${id}`);
        const { project } = response.data;
        setProject(project);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      }
    };

    getProject();
  }, [id]);

  if (!project) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="w-fit mx-auto">
        <Timer
          workingHoursPerDay={project.workingHoursPerDay}
          breakMinutesPerDay={project.breakMinutesPerDay}
        />
      </div>
    </div>
  );
}
