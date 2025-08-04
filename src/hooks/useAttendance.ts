import { useState, useEffect } from 'react';
import { Subject, AttendanceRecord, AttendanceStats } from '@/types/attendance';

// Empty defaults for fresh start
const defaultSubjects: Subject[] = [];

const defaultAttendanceRecords: AttendanceRecord[] = [];

// Storage keys
const SUBJECTS_STORAGE_KEY = 'attendance_subjects';
const RECORDS_STORAGE_KEY = 'attendance_records';

// Helper functions for localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export function useAttendance() {
  const [subjects, setSubjects] = useState<Subject[]>(() => 
    loadFromStorage(SUBJECTS_STORAGE_KEY, defaultSubjects)
  );
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    loadFromStorage(RECORDS_STORAGE_KEY, defaultAttendanceRecords)
  );

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(SUBJECTS_STORAGE_KEY, subjects);
  }, [subjects]);

  useEffect(() => {
    saveToStorage(RECORDS_STORAGE_KEY, attendanceRecords);
  }, [attendanceRecords]);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString(),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, ...updates } : subject
    ));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    setAttendanceRecords(prev => prev.filter(record => record.subjectId !== id));
  };

  const markAttendance = (subjectId: string, date: string, status: 'present' | 'absent') => {
    const existingRecord = attendanceRecords.find(
      record => record.subjectId === subjectId && record.date === date
    );

    let newRecord: AttendanceRecord | null = null;

    if (existingRecord) {
      setAttendanceRecords(prev => prev.map(record => 
        record.id === existingRecord.id ? { ...record, status } : record
      ));
    } else {
      newRecord = {
        id: Date.now().toString(),
        subjectId,
        date,
        status
      };
      setAttendanceRecords(prev => [...prev, newRecord!]);
    }

    // Update subject attendance counts in real-time
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      const updatedSubjects = subjects.map(s => {
        if (s.id === subjectId) {
          const subjectRecords = attendanceRecords.filter(r => r.subjectId === subjectId);
          const newRecords = existingRecord 
            ? subjectRecords.map(r => r.id === existingRecord.id ? { ...r, status } : r)
            : [...subjectRecords, newRecord!];
          
          const presentCount = newRecords.filter(r => r.status === 'present' || r.status === 'duty-leave').length;
          const totalCount = newRecords.length;
          
          return {
            ...s,
            classesHeld: Math.max(s.classesHeld, totalCount),
            classesAttended: presentCount
          };
        }
        return s;
      });
      
      setSubjects(updatedSubjects);
    }
  };

  const toggleDutyLeave = (recordId: string) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: record.status === 'duty-leave' ? 'absent' : 'duty-leave' }
        : record
    ));
  };

  const getTodaysSubjects = (date: string = new Date().toISOString().split('T')[0]) => {
    const dayOfWeek = new Date(date).getDay();
    return subjects.filter(subject => subject.daysOfWeek.includes(dayOfWeek));
  };

  const getAttendanceStats = (subjectId?: string): AttendanceStats => {
    const relevantRecords = subjectId 
      ? attendanceRecords.filter(r => r.subjectId === subjectId)
      : attendanceRecords;

    const totalPresent = relevantRecords.filter(r => r.status === 'present' || r.status === 'duty-leave').length;
    const totalAbsent = relevantRecords.filter(r => r.status === 'absent').length;
    const totalDutyLeave = relevantRecords.filter(r => r.status === 'duty-leave').length;
    const total = relevantRecords.length;

    return {
      totalPresent,
      totalAbsent,
      totalDutyLeave,
      attendancePercentage: total > 0 ? (totalPresent / total) * 100 : 0
    };
  };

  return {
    subjects,
    attendanceRecords,
    addSubject,
    updateSubject,
    deleteSubject,
    markAttendance,
    toggleDutyLeave,
    getTodaysSubjects,
    getAttendanceStats
  };
}