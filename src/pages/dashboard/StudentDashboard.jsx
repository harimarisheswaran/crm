import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SubmitHomeworkModal } from '../../components/modals/SubmitHomeworkModal';
import { ReportCardModal } from '../../components/modals/ReportCardModal';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  CalendarCheck,
  Calendar,
  FileText,
  Award,
  BookOpen,
  Download,
  Printer,
  Clock,
  Sparkles,
  ChevronRight,
  Megaphone,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { students, timetables, homework, marks, examinations, bookIssues, announcements } = useData();

  const [selectedHw, setSelectedHw] = useState(null);
  const [reportCardOpen, setReportCardOpen] = useState(false);

  // Default to student Liam Evans (std-001)
  const student = students.find((s) => s.email === user?.email) || students[0];

  // Today's classes for student's class (cls-10 / Grade 10-A)
  const todayClasses = timetables.filter(
    (t) => t.day_of_week === 'Monday' && t.class_id === 'cls-10' && !t.is_break
  );

  // Student specific homework
  const myHomework = homework.filter((h) => h.class_id === 'cls-10');

  // Student marks
  const myMarks = marks.filter((m) => m.student_id === student?.id);

  // Student books
  const myBooks = bookIssues.filter((b) => b.student_id === student?.id);

  return (
    <div className="space-y-6">
      {/* Student Banner Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-gradient-to-r from-slate-900 to-navy-800 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <img
          src={student?.photo_url}
          alt={student?.full_name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md flex-shrink-0"
        />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">{student?.full_name}</h1>
            <Badge variant="success" size="sm" dot>
              {student?.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Admission No: <span className="font-mono font-semibold">{student?.admission_number}</span> • Grade 10-A • Roll #12
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-300">
            <span>Cumulative GPA: <strong className="text-white">3.92 / 4.0</strong></span>
            <span>•</span>
            <span>Class Rank: <strong className="text-brand-400">2nd of 120</strong></span>
            <span>•</span>
            <span>Attendance: <strong className="text-emerald-400">{student?.attendance_rate || 96.5}%</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={() => setReportCardOpen(true)}
          >
            My Report Card
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{student?.attendance_rate || 96.5}%</span>
            <span className="text-xs font-semibold text-emerald-600">Excellent</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Eligible for honors roll</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Periods</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-600">{todayClasses.length} Lectures</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">08:30 AM - 02:20 PM</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Homework</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{myHomework.length} Pending</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculus due in 4 days</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Library Books</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-600">{myBooks.length} Checked Out</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1 book due Nov 21</p>
        </Card>
      </div>

      {/* Timetable & Active Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card
          title="Today's Timetable Schedule"
          subtitle="Monday lectures and classroom locations"
          action={
            <Link to="/timetables">
              <Button variant="outline" size="sm" icon={Calendar}>
                Full Week
              </Button>
            </Link>
          }
        >
          <div className="space-y-3">
            {todayClasses.map((period) => (
              <div
                key={period.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center">
                    P{period.period_number}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{period.subject_name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Instructor: {period.teacher_name} • {period.room_number}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-slate-800">
                    {period.start_time} - {period.end_time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Assigned Homework & Turn In */}
        <Card
          title="My Assignments & Problem Sets"
          subtitle="Review instructions and submit your homework online"
        >
          <div className="space-y-3">
            {myHomework.map((hw) => (
              <div
                key={hw.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{hw.title}</span>
                    <Badge variant="pending" size="sm">
                      {hw.subject_name}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{hw.description}</p>
                  <span className="text-[10px] text-rose-600 font-semibold mt-1 block">
                    Deadline: {hw.due_date} • Max Score: {hw.max_score} pts
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedHw(hw)}
                  className="flex-shrink-0"
                >
                  Turn In
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Examination Performance & Library */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exam Marks */}
        <Card
          title="Latest Midterm Grades"
          subtitle="Subject marks obtained in Fall Midterm Examinations"
          action={
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => setReportCardOpen(true)}
            >
              Report Card
            </Button>
          }
        >
          <div className="divide-y divide-slate-100">
            {myMarks.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">Exam Assessment</span>
                  <span className="text-[11px] text-slate-500 italic">{m.remarks}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{m.marks_obtained} / 100</span>
                  <Badge variant="success" size="sm">
                    {m.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* School Notice Board */}
        <Card
          title="Campus Announcements"
          subtitle="Official updates from academy leadership"
        >
          <div className="space-y-3">
            {announcements.slice(0, 3).map((anc) => (
              <div key={anc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{anc.title}</span>
                  <Badge variant={anc.importance === 'urgent' ? 'danger' : 'primary'} size="sm">
                    {anc.importance}
                  </Badge>
                </div>
                <p className="text-slate-600 line-clamp-2">{anc.content}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Posted on {anc.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <SubmitHomeworkModal
        homework={selectedHw}
        isOpen={!!selectedHw}
        onClose={() => setSelectedHw(null)}
      />

      <ReportCardModal
        student={student}
        examination={examinations[0]}
        isOpen={reportCardOpen}
        onClose={() => setReportCardOpen(false)}
      />
    </div>
  );
};

