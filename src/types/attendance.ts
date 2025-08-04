export interface Subject {
  id: string;
  name: string;
  classesHeld: number;
  classesAttended: number;
  requiredAttendance: number;
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  color: string;
  semester?: string;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'duty-leave';
  reason?: string;
}

export interface DaySchedule {
  date: string;
  subjects: Subject[];
}

export interface AttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalDutyLeave: number;
  attendancePercentage: number;
}