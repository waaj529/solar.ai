import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Progress } from "../../shared/ui/progress";
import { CheckCircle, Clock, Calendar } from "lucide-react";

export function ProjectTimeline() {
  const phases = [
    {
      phase: "Design & Engineering",
      duration: "2 weeks",
      status: "completed",
      progress: 100,
      startDate: "2024-01-15",
      endDate: "2024-01-29",
      tasks: [
        "Site assessment and measurement",
        "Electrical design and calculations",
        "Structural analysis",
        "Permit application preparation"
      ]
    },
    {
      phase: "Permitting & Approvals",
      duration: "3-4 weeks",
      status: "in-progress",
      progress: 60,
      startDate: "2024-01-30",
      endDate: "2024-02-26",
      tasks: [
        "Submit building permit application",
        "Utility interconnection application",
        "HOA approval (if applicable)",
        "Final permit approval"
      ]
    },
    {
      phase: "Procurement & Logistics",
      duration: "1-2 weeks",
      status: "pending",
      progress: 0,
      startDate: "2024-02-27",
      endDate: "2024-03-12",
      tasks: [
        "Order solar panels and equipment",
        "Schedule delivery coordination",
        "Prepare installation crew",
        "Final site preparation"
      ]
    },
    {
      phase: "Installation",
      duration: "2-3 days",
      status: "pending",
      progress: 0,
      startDate: "2024-03-13",
      endDate: "2024-03-15",
      tasks: [
        "Roof preparation and mounting",
        "Panel installation and wiring",
        "Inverter and electrical connections",
        "System testing and commissioning"
      ]
    },
    {
      phase: "Inspection & Grid Connection",
      duration: "1-2 weeks",
      status: "pending",
      progress: 0,
      startDate: "2024-03-16",
      endDate: "2024-03-29",
      tasks: [
        "Local authority inspection",
        "Utility final inspection",
        "Permission to operate (PTO)",
        "System activation"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Project Execution Timeline</h2>
        <p className="text-muted-foreground">Comprehensive project schedule from design to grid connection.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8-12 weeks</div>
            <p className="text-sm text-muted-foreground">End-to-end timeline</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Current Phase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Permitting</div>
            <p className="text-sm text-muted-foreground">60% complete</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Expected Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">March 29, 2024</div>
            <p className="text-sm text-muted-foreground">System activation</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getStatusIcon(phase.status)}
                <span className={getStatusColor(phase.status)}>{phase.phase}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  ({phase.duration})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Start: {phase.startDate}</span>
                <span>End: {phase.endDate}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{phase.progress}%</span>
                </div>
                <Progress value={phase.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center gap-2 text-sm">
                    {phase.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : phase.status === "in-progress" && taskIndex < 2 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={
                      phase.status === "completed" || (phase.status === "in-progress" && taskIndex < 2)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }>
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}