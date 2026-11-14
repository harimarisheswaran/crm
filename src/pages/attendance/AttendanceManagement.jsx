import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { exportToCSV, formatDate } from '../../lib/utils';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Download,
  Printer,
  Calendar,
  Filter,
  Users,
} from 'lucide-react';

export const AttendanceManagement = () => {
  const { classes, sections, students, attendance, markDailyAttendance, teachers } = useData();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('daily_students'); // 'daily_students' | 'teacher_attendance' | 'monthly_report'
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-10');
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || 'sec-10A');
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Filter students for chosen class & section
  const targetStudents = students.filter(
    (s) => s.class_id === selectedClassId && (!selectedSectionId || s.section_id === selectedSectionId)
  );

  // Initialize attendance state from existing database records or default to 'present'
  const [studentStatuses, setStudentStatuses] = useState(() => {
    const map = {};
    targetStudents.forEach((st) => {
      const match = attendance.find(
        (a) => a.student_id === st.id && a.attendance_date === attendanceDate
      );
      map[st.id] = {
        status: match ? match.status : 'present',
        remarks: match ? match.remarks : '',
      };
    });
    return map;
  });

  const handleStatusChange = (studentId, newStatus) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: newStatus,
      },
    }));
  };

  const handleRemarksChange = (studentId, text) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: text,
      },
    }));
  };

  const markAll = (status) => {
    const updated = {};
    targetStudents.forEach((st) => {
      updated[st.id] = {
        status,
        remarks: status === 'absent' ? 'Unexcused' : '',
      };
    });
    setStudentStatuses((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveAttendance = () => {
    const records = targetStudents.map((st) => ({
      student_id: st.id,
      student_name: st.full_name,
      class_id: selectedClassId,
      section_id: selectedSectionId,
      attendance_date: attendanceDate,
      status: studentStatuses[st.id]?.status || 'present',
      remarks: studentStatuses[st.id]?.remarks || '',
    }));

    markDailyAttendance(records);
    success(`Daily attendance saved successfully for ${records.length} students!`);
  };

  // Metrics
  const totalCount = targetStudents.length;
  const presentCount = targetStudents.filter(
    (s) => (studentStatuses[s.id]?.status || 'present') === 'present'
  ).length;
  const absentCount = targetStudents.filter(
    (s) => studentStatuses[s.id]?.status === 'absent'
  ).length;
  const lateCount = targetStudents.filter(
    (s) => studentStatuses[s.id]?.status === 'late'
  ).length;
  const percentPresent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  const handleExportCSV = () => {
    const dataToExport = targetStudents.map((st) => ({
      'Date': attendanceDate,
      'Student Name': st.full_name,
      'Admission Number': st.admission_number,
      'Class': `${st.class_name}-${st.section_name}`,
      'Status': studentStatuses[st.id]?.status || 'present',
      'Remarks': studentStatuses[st.id]?.remarks || '',
    }));
    exportToCSV(dataToExport, `Attendance_${attendanceDate}_${selectedClassId}.csv`);
    success('Attendance record exported to CSV!');
  };

  const tabs = [
    { id: 'daily_students', label: 'Daily Student Attendance', icon: CalendarCheck },
    { id: 'teacher_attendance', label: 'Teacher Attendance Sheet', icon: Users },
    { id: 'monthly_report', label: 'Monthly Reports & Analytics', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daily roll marking, class-wise verification, monthly rates, and multi-format reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Save}
            onClick={handleSaveAttendance}
          >
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'daily_students' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const relSec = sections.filter((s) => s.class_id === e.target.value);
                    setSelectedSectionId(relSec[0]?.id || '');
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Section
                </label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  {sections
                    .filter((s) => s.class_id === selectedClassId)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        Section {s.name} ({s.room_number})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Batch actions */}
            <div className="flex items-center gap-2 pt-2 md:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAll('present')}
                className="text-xs"
              >
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAll('absent')}
                className="text-xs text-rose-600 hover:bg-rose-50"
              >
                Mark All Absent
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 text-xs block">Enrolled</span>
              <span className="text-xl font-bold text-slate-900">{totalCount}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-emerald-600 text-xs block">Present</span>
              <span className="text-xl font-bold text-emerald-700">{presentCount}</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
              <span className="text-rose-600 text-xs block">Absent</span>
              <span className="text-xl font-bold text-rose-700">{absentCount}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <span className="text-amber-600 text-xs block">Late</span>
              <span className="text-xl font-bold text-amber-700">{lateCount}</span>
            </div>
            <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-center col-span-2 sm:col-span-1">
              <span className="text-brand-600 text-xs block">Attendance %</span>
              <span className="text-xl font-bold text-brand-700">{percentPresent}%</span>
            </div>
          </div>

          {/* Marking Table */}
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4 text-center">Status Selection</th>
                    <th className="py-3 px-4">Remarks / Excuse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {targetStudents.map((st) => {
                    const currentStatus = studentStatuses[st.id]?.status || 'present';
                    const currentRemarks = studentStatuses[st.id]?.remarks || '';

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">#{st.roll_number || '12'}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={st.photo_url}
                              alt={st.full_name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{st.full_name}</span>
                              <span className="text-[10px] text-slate-400">{st.parent_phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{st.admission_number}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {['present', 'absent', 'late', 'half_day', 'excused'].map((stKey) => {
                              const isSelected = currentStatus === stKey;
                              return (
                                <button
                                  key={stKey}
                                  type="button"
                                  onClick={() => handleStatusChange(st.id, stKey)}
                                  className={`px-2.5 py-1 rounded-lg font-bold text-xs capitalize transition-all ${
                                    isSelected
                                      ? stKey === 'present'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : stKey === 'absent'
                                        ? 'bg-rose-600 text-white shadow-sm'
                                        : stKey === 'late'
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : 'bg-brand-600 text-white shadow-sm'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {stKey.replace('_', ' ')}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={currentRemarks}
                            onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                            placeholder="Optional remark..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-brand-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'teacher_attendance' && (
        <Card
          title="Faculty Daily Attendance Log"
          subtitle="Record teaching staff check-in and presence"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Faculty Name</th>
                  <th className="py-2.5 px-3">Employee ID</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Check-in Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((tch) => (
                  <tr key={tch.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{tch.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{tch.employee_id}</td>
                    <td className="py-3 px-3 text-slate-700">{tch.department}</td>
                    <td className="py-3 px-3">
                      <Badge variant="present" size="sm" dot>
                        Present
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">07:55 AM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'monthly_report' && (
        <Card
          title="Monthly Attendance Summary & Cumulative Percentage"
          subtitle="Term-to-date attendance standings across all secondary students"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3 text-center">Total School Days</th>
                  <th className="py-2.5 px-3 text-center">Days Present</th>
                  <th className="py-2.5 px-3 text-center">Days Absent</th>
                  <th className="py-2.5 px-3 text-center">Attendance %</th>
                  <th className="py-2.5 px-3 text-center">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const rate = st.attendance_rate || 96.5;
                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{st.full_name}</td>
                      <td className="py-3 px-3">{st.class_name}-{st.section_name}</td>
                      <td className="py-3 px-3 text-center font-semibold">145</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">
                        {Math.round((rate / 100) * 145)}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-rose-600">
                        {145 - Math.round((rate / 100) * 145)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-slate-900">{rate}%</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={rate >= 85 ? 'success' : 'warning'} size="sm">
                          {rate >= 85 ? 'Exam Eligible' : 'Warning'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

