import { useState } from "react";
import { FileText, Calendar, Edit, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAttendance } from "@/hooks/useAttendance";
import { format } from "date-fns";

interface DutyLeave {
  id: string;
  date: string;
  subjectId: string;
  reason: string;
  approved: boolean;
}

export default function DutyLeave() {
  const { subjects } = useAttendance();
  const [dutyLeaves, setDutyLeaves] = useState<DutyLeave[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    date: "",
    subjectId: "",
    reason: ""
  });

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || "Subject Not Found";
  };

  const handleAddLeave = () => {
    if (newLeave.date && newLeave.subjectId && newLeave.reason) {
      const leave: DutyLeave = {
        id: Date.now().toString(),
        date: newLeave.date,
        subjectId: newLeave.subjectId,
        reason: newLeave.reason,
        approved: false
      };
      setDutyLeaves([...dutyLeaves, leave]);
      setNewLeave({ date: "", subjectId: "", reason: "" });
      setIsAddDialogOpen(false);
    }
  };

  const toggleApproval = (id: string) => {
    setDutyLeaves(dutyLeaves.map(leave => 
      leave.id === id ? { ...leave, approved: !leave.approved } : leave
    ));
  };

  const deleteLeave = (id: string) => {
    setDutyLeaves(dutyLeaves.filter(leave => leave.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Duty Leave Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your duty leaves and authorized absences</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Duty Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Duty Leave</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newLeave.date}
                  onChange={(e) => setNewLeave({ ...newLeave, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newLeave.subjectId}
                  onChange={(e) => setNewLeave({ ...newLeave, subjectId: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  placeholder="e.g., College Event, Sports Competition"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                />
              </div>
              <Button onClick={handleAddLeave} className="w-full">
                Add Duty Leave
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {dutyLeaves.length === 0 ? (
          <Card className="bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-sm border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Duty Leaves</h3>
              <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
                You haven't added any duty leaves yet. Click the button above to add one.
              </p>
            </CardContent>
          </Card>
        ) : (
          dutyLeaves.map((leave) => (
            <Card key={leave.id} className="bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm border-border/40 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 pb-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">{getSubjectName(leave.subjectId)}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(leave.date), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
                  <Badge variant={leave.approved ? "default" : "secondary"} className="text-xs">
                    {leave.approved ? "Approved" : "Pending"}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApproval(leave.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLeave(leave.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{leave.reason}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}