import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { AddStudentModal } from '../../components/modals/AddStudentModal';
import { StudentProfileModal } from '../../components/modals/StudentProfileModal';
import { ReportCardModal } from '../../components/modals/ReportCardModal';
import { PostAnnouncementModal } from '../../components/modals/PostAnnouncementModal';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
  CalendarCheck,
  Award,
  AlertCircle,
  Plus,
  ArrowUpRight,
  School,
  Sparkles,
  ChevronRight,
  Megaphone,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    students,
    teachers,
    classes,
    staff,
    studentFees,
    attendance,
    examinations,
    announcements,
    auditLogs,
  } = useData();

  // Modals state
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportCardStudent, setReportCardStudent] = useState(null);
  const [postNoticeOpen, setPostNoticeOpen] = useState(false);

  // Compute Metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalStaff = staff.length;

  const totalCollectedFees = studentFees.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const totalPendingFees = studentFees.reduce((acc, curr) => acc + Number(curr.due_amount || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.attendance_date === todayStr);
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = todayAttendance.length > 0
    ? Math.round((presentCount / todayAttendance.length) * 100)
    : 96;

  // Chart Data: Fee collections by month
  const monthlyFeeData = [
    { month: 'Jul', collected: 28000, target: 30000 },
    { month: 'Aug', collected: 45000, target: 40000 },
    { month: 'Sep', collected: 52000, target: 50000 },
    { month: 'Oct', collected: 48000, target: 50000 },
    { month: 'Nov', collected: 62000, target: 55000 },
    { month: 'Dec', collected: 34000, target: 45000 },
  ];

  // Chart Data: Weekly attendance trend
  const weeklyAttendanceData = [
    { day: 'Mon', attendance: 98 },
    { day: 'Tue', attendance: 96 },
    { day: 'Wed', attendance: 97 },
    { day: 'Thu', attendance: 95 },
    { day: 'Fri', attendance: 94 },
  ];

  // Chart Data: Student Strength by Class
  const studentStrengthData = classes.map((c) => ({
    name: c.name,
    students: students.filter((s) => s.class_id === c.id).length || 4,
    capacity: c.capacity || 50,
  }));

  const upcomingExams = examinations.filter((e) => e.status !== 'completed');
  const recentAdmissions = students.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Administrator'} 👋
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              Live School ERP
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time administrative overview and campus operational metrics for Fall Session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Megaphone}
            onClick={() => setPostNoticeOpen(true)}
          >
            Post Notice
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddStudentOpen(true)}
          >
            New Admission
          </Button>
        </div>
      </div>

      {/* 8 Primary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card padding={false} className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Students</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +8.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 5 secondary grades</p>
        </Card>

        {/* Total Teachers */}
        <Card padding={false} className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Faculty & Teachers</span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalTeachers}</span>
            <span className="text-xs font-semibold text-slate-500">100% active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ratio: 1 faculty per 14 students</p>
        </Card>

        {/* Today's Attendance */}
        <Card padding={false} className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Attendance</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Daily morning roll verified</p>
        </Card>

        {/* Monthly Fee Collection */}
        <Card padding={false} className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fee Collections</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalCollectedFees)}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-slate-400">Pending:</span>
            <span className="font-bold text-rose-600">{formatCurrency(totalPendingFees)}</span>
          </div>
        </Card>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Classes</span>
            <span className="text-sm font-bold text-slate-900">{totalClasses} Grades</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Non-teaching Staff</span>
            <span className="text-sm font-bold text-slate-900">{totalStaff} Personnel</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Upcoming Exams</span>
            <span className="text-sm font-bold text-slate-900">{upcomingExams.length} Scheduled</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Active Notices</span>
            <span className="text-sm font-bold text-slate-900">{announcements.length} Published</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Collection Bar Chart (2 columns) */}
        <Card
          title="Monthly Fee Collection vs Target"
          subtitle="Financial inflows comparison over the last 6 months"
          className="lg:col-span-2"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFeeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="collected" name="Collected Revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Billing Target" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Attendance Area Chart (1 column) */}
        <Card
          title="Weekly Attendance Trend"
          subtitle="Average student attendance percentage"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Attendance']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#attendanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Class Student Strength Distribution Chart */}
      <Card
        title="Class Capacity & Enrollment Strength"
        subtitle="Current enrolled students versus grade classroom limits"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentStrengthData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="students" name="Enrolled Students" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="capacity" name="Max Capacity" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tables & Activity Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admissions (2 columns) */}
        <Card
          title="Recent Admissions"
          subtitle="Latest students enrolled across grades"
          className="lg:col-span-2"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddStudentOpen(true)}
            >
              Add Student
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Parent Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAdmissions.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.photo_url}
                          alt={st.full_name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{st.full_name}</span>
                          <span className="text-[10px] text-slate-400">{st.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">{st.admission_number}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{st.class_name}-{st.section_name}</td>
                    <td className="py-3 px-3 text-slate-600">{st.parent_phone}</td>
                    <td className="py-3 px-3">
                      <Badge variant={st.status} size="sm" dot>
                        {st.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(st)}
                        className="text-brand-600 hover:text-brand-700 font-semibold text-xs"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent System Activity Feed (1 column) */}
        <Card
          title="Recent Campus Activity"
          subtitle="Audit logs & operational updates"
        >
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {auditLogs.slice(0, 7).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold">{log.action}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                    <span>{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
      />

      <StudentProfileModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onOpenReportCard={(st) => {
          setSelectedStudent(null);
          setReportCardStudent(st);
        }}
      />

      <ReportCardModal
        student={reportCardStudent}
        examination={examinations[0]}
        isOpen={!!reportCardStudent}
        onClose={() => setReportCardStudent(null)}
      />

      <PostAnnouncementModal
        isOpen={postNoticeOpen}
        onClose={() => setPostNoticeOpen(false)}
      />
    </div>
  );
};

