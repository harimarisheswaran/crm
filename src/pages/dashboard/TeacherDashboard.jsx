import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ApplyLeaveModal } from '../../components/modals/ApplyLeaveModal';
import { AddHomeworkModal } from '../../components/modals/AddHomeworkModal';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarCheck,
  FileText,
  Clock,
  Plus,
  Calendar,
  CheckCircle,
  Users,
  Award,
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const { timetables, homework, students, examinations } = useData();
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false);
  const [addHomeworkOpen, setAddHomeworkOpen] = useState(false);

  // Filter today's timetable slots for this teacher
  const teacherTimetable = timetables.filter(
    (t) => t.day_of_week === 'Monday' && t.teacher_name?.includes('Marcus Vance')
  );

  const teacherHomework = homework.filter(
    (h) => h.assigned_by_name?.includes('Marcus Vance') || h.subject_name === 'Mathematics'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Faculty Workspace — {user?.full_name || 'Prof. Marcus Vance'} 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of Mathematics • Head of Faculty • Grade 10-A Mentor
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Calendar}
            onClick={() => setApplyLeaveOpen(true)}
          >
            Apply for Leave
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddHomeworkOpen(true)}
          >
            Assign Homework
          </Button>
        </div>
      </div>

      {/* Faculty KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">My Students</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">54</span>
            <span className="text-xs text-slate-500">Across 2 Sections</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Grade 10-A & Grade 9-B</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Lectures</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-600">3 Sessions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Next: Period 2 @ 09:25 AM</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Homework Submissions</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">46 Turn-ins</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">2 Pending review</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Exams</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600">Unit Test 2</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Starting Dec 10th</p>
        </Card>
      </div>

      {/* Lectures Schedule & Assigned Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Teaching Schedule */}
        <Card
          title="Today's Teaching Schedule"
          subtitle="Assigned classroom periods and laboratory hours"
          action={
            <Link to="/attendance">
              <Button variant="outline" size="sm" icon={CalendarCheck}>
                Take Attendance
              </Button>
            </Link>
          }
        >
          <div className="space-y-3">
            {teacherTimetable.length > 0 ? (
              teacherTimetable.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
                      P{slot.period_number}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{slot.subject_name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Class 10-A • {slot.room_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-slate-700 block">
                      {slot.start_time} - {slot.end_time}
                    </span>
                    <Badge variant="present" size="sm">
                      Confirmed
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No teaching lectures scheduled for today.
              </div>
            )}
          </div>
        </Card>

        {/* Assigned Homework & Deadlines */}
        <Card
          title="Active Homework Assignments"
          subtitle="Manage class problem sets and review student answers"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddHomeworkOpen(true)}
            >
              New Assignment
            </Button>
          }
        >
          <div className="space-y-3">
            {teacherHomework.map((hw) => (
              <div
                key={hw.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{hw.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    {hw.class_name} • Due: {hw.due_date} • Max: {hw.max_score} pts
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-brand-600 block">
                    {hw.submissions_count || 24} Turn-ins
                  </span>
                  <Link
                    to="/homework"
                    className="text-[11px] font-semibold text-slate-600 hover:text-brand-600"
                  >
                    Grade & Feedback →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={applyLeaveOpen}
        onClose={() => setApplyLeaveOpen(false)}
      />
      <AddHomeworkModal
        isOpen={addHomeworkOpen}
        onClose={() => setAddHomeworkOpen(false)}
      />
    </div>
  );
};

