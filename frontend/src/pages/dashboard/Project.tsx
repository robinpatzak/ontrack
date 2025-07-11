import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading3, Muted } from "@/components/ui/typography";
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

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
      <div className="text-center mb-4">
        <Heading3>{project.title}</Heading3>
        <Muted>{project.description}</Muted>
      </div>
      <Separator className="my-4" />
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Working Hours per Day</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {project.workingHoursPerDay}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Break Minutes per Day</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {project.breakMinutesPerDay}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Hourly Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              € {project.hourlyRate}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Separator className="my-4" />
      <div className="grid sm:grid-cols-4 grid-cols-1 gap-4">
        <Card className="bg-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              Time Tracker
            </CardTitle>
            <Button asChild>
              <Link to={`/dashboard/${id}/timetracking`}>Start tracking</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
