import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading2, Text } from "@/components/ui/typography";

type RoadmapItem = {
  title: string;
  description?: string;
  status: "planned" | "in-progress" | "done";
};

const roadmap: Record<string, RoadmapItem[]> = {
  "Q3 2025": [
    {
      title: "Roadmap",
      description:
        "Create a dedicated roadmap route and find a better use for the dashboard root.",
      status: "in-progress",
    },
    {
      title: "Dashboard Root",
      description:
        "Having quick links and similar helpful things on the dashboard root.",
      status: "in-progress",
    },
    {
      title: "Edit project settings",
      description: "Allow users to edit the project settings.",
      status: "in-progress",
    },
    {
      title: "User settings",
      description:
        "Allow users to edit their information, like email address, display name, etc...",
      status: "in-progress",
    },
    {
      title: "More granular control over time entries",
      description:
        "Having the ability to view all the start and end times for work and break times, as well as editing these afterwards or while adding a manual time entry.",
      status: "planned",
    },
    {
      title: "Graphs",
      description: "Display graphs from the time entry data.",
      status: "planned",
    },
    {
      title: "Edit & delete time entries",
      description: "Allow users to modify or remove existing entries.",
      status: "planned",
    },
    {
      title: "CSV Import and Export",
      description:
        "Users can import timesheets from external systems and export to CSVs.",
      status: "planned",
    },
    {
      title: "Dark mode and color customization",
      description:
        "Automatic or manual dark/light theme toggle. Ability to set personalized colors",
      status: "planned",
    },
    {
      title: "Mobile App",
      description:
        "Building a mobile app version of the app using capacitor or tauri",
      status: "planned",
    },
  ],
};

const statusClass: Record<RoadmapItem["status"], string> = {
  planned: "bg-muted text-muted-foreground",
  "in-progress": "bg-yellow-200 text-yellow-900",
  done: "bg-green-200 text-green-900",
};

export default function DashboardRoute() {
  return (
    <div className="space-y-6">
      <Heading2>Roadmap</Heading2>

      <Text>
        This app is still work in progress. Below you will find features I still
        want to implement. As I am a solo developer on the project and I have a
        full time job, I cannot guarantee meeting due dates, but I can try to
        set these estimates.
      </Text>

      <Accordion type="multiple">
        {Object.entries(roadmap).map(([quarter, items]) => (
          <AccordionItem key={quarter} value={quarter}>
            <AccordionTrigger>{quarter}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <Card key={idx} className="border-muted">
                    <CardContent className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge className={statusClass[item.status]}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
