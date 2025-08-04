import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceStats } from "@/types/attendance";

interface QuickStatsBarProps {
  stats: AttendanceStats;
}

export function QuickStatsBar({ stats }: QuickStatsBarProps) {
  const statItems = [
    {
      label: "Present Today",
      value: stats.totalPresent,
      icon: TrendingUp,
      color: "text-success"
    },
    {
      label: "Absent Today", 
      value: stats.totalAbsent,
      icon: TrendingDown,
      color: "text-destructive"
    },
    {
      label: "Duty Leaves",
      value: stats.totalDutyLeave,
      icon: Clock,
      color: "text-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`${item.color} bg-current/10 p-2 rounded-lg`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}