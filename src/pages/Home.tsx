import { useAttendance } from "@/hooks/useAttendance";
import { TodaysSummary } from "@/components/home/TodaysSummary";
import { SubjectCard } from "@/components/home/SubjectCard";
import { QuickStatsBar } from "@/components/home/QuickStatsBar";

export default function Home() {
  const { 
    getTodaysSubjects, 
    markAttendance, 
    attendanceRecords, 
    getAttendanceStats 
  } = useAttendance();

  const today = new Date().toISOString().split('T')[0];
  const todaysSubjects = getTodaysSubjects(today);
  
  // Get today's attendance records
  const todaysRecords = attendanceRecords.filter(record => record.date === today);
  const todaysStats = getAttendanceStats();

  const handleMarkAttendance = (subjectId: string, status: 'present' | 'absent') => {
    markAttendance(subjectId, today, status);
  };

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <TodaysSummary date={today} totalClasses={todaysSubjects.length} />

      {/* Quick Stats */}
      <QuickStatsBar stats={todaysStats} />

      {/* Subject List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Classes</h2>
        
        {todaysSubjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todaysSubjects.map((subject) => {
              const attendanceRecord = todaysRecords.find(
                record => record.subjectId === subject.id
              );
              
              return (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  attendanceRecord={attendanceRecord}
                  onMarkAttendance={handleMarkAttendance}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No classes scheduled for today!</p>
            <p className="text-sm mt-2">Enjoy your free day 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}