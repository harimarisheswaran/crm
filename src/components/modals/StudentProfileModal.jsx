import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate, calculateGrade } from '../../lib/utils';
import {
  User,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Award,
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Printer,
  Calendar,
} from 'lucide-react';

export const StudentProfileModal = ({ student, isOpen, onClose, onOpenReportCard, onOpenFeeReceipt }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { studentFees, attendance, marks, examSubjects, school } = useData();

  if (!student) return null;

  // Student specific data
  const studentInvoices = studentFees.filter((f) => f.student_id === student.id);
  const studentAttendance = attendance.filter((a) => a.student_id === student.id);
  const studentMarks = marks.filter((m) => m.student_id === student.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, badge: `${student.attendance_rate || 95}%` },
    { id: 'fees', label: 'Fee Invoices', icon: CreditCard, badge: studentInvoices.length },
    { id: 'exams', label: 'Academic & Exams', icon: Award, badge: studentMarks.length },
    { id: 'medical', label: 'Emergency & Medical', icon: HeartPulse },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${student.full_name}`}
      subtitle={`Admission #${student.admission_number} • ${student.class_name} - Section ${student.section_name}`}
      maxWidth="max-w-4xl"
    >
      {/* Top Banner Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-navy-800 text-white mb-6">
        <img
          src={student.photo_url}
          alt={student.full_name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
        />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold">{student.full_name}</h2>
            <Badge variant={student.status === 'active' ? 'success' : 'default'} size="sm" dot>
              {student.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Roll No: {student.roll_number || '12'} • Class: {student.class_name}-{student.section_name} • Academic Year: {student.academic_year || '2024-2025'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              {student.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              {student.parent_phone}
            </span>
          </div>
        </div>

        {onOpenReportCard && (
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={() => onOpenReportCard(student)}
            className="flex-shrink-0"
          >
            Report Card
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab Content */}
      <div className="min-h-[280px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Demographics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Date of Birth:</span>
                  <span className="font-semibold text-slate-800">{student.dob}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Gender:</span>
                  <span className="font-semibold text-slate-800">{student.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Blood Group:</span>
                  <span className="font-semibold text-slate-800">{student.blood_group || 'O+'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Nationality:</span>
                  <span className="font-semibold text-slate-800">{student.nationality || 'American'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Home Address:</span>
                  <span className="font-semibold text-slate-800">{student.address || '742 Evergreen Terrace'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Parent & Guardian Information
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Parent / Guardian:</span>
                  <span className="font-semibold text-slate-800">{student.parent_name || 'Robert Evans'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Occupation:</span>
                  <span className="font-semibold text-slate-800">{student.father_occupation || 'Professional'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Emergency Phone:</span>
                  <span className="font-semibold text-slate-800">{student.parent_phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Parent Email:</span>
                  <span className="font-semibold text-slate-800 truncate block">{student.parent_email || 'parent@oakridge.edu'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Prior School:</span>
                  <span className="font-semibold text-slate-800">{student.previous_school_name || 'St. Jude Preparatory School'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-xl font-bold text-emerald-700">{student.attendance_rate || 96.5}%</span>
                <span className="block text-[11px] text-emerald-600 font-medium mt-0.5">Overall Attendance Rate</span>
              </div>
              <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-center">
                <span className="text-xl font-bold text-brand-700">142 Days</span>
                <span className="block text-[11px] text-brand-600 font-medium mt-0.5">Present to Date</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                <span className="text-xl font-bold text-amber-700">3 Days</span>
                <span className="block text-[11px] text-amber-600 font-medium mt-0.5">Excused Absences</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                Recent Attendance Log
              </div>
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {studentAttendance.length > 0 ? (
                  studentAttendance.map((rec) => (
                    <div key={rec.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-800">{formatDate(rec.attendance_date)}</span>
                        {rec.remarks && <span className="text-slate-400">({rec.remarks})</span>}
                      </div>
                      <Badge variant={rec.status} size="sm" dot>
                        {rec.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">No attendance entries recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FEES TAB */}
        {activeTab === 'fees' && (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Invoice #</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Fee Title</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Total</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Paid</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Due</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentInvoices.length > 0 ? (
                    studentInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-semibold text-slate-900">{inv.invoice_number}</td>
                        <td className="py-3 px-3 text-slate-800 font-medium">{inv.title}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{formatCurrency(inv.total_amount)}</td>
                        <td className="py-3 px-3 text-emerald-600 font-semibold">{formatCurrency(inv.paid_amount)}</td>
                        <td className="py-3 px-3 font-semibold text-rose-600">{formatCurrency(inv.due_amount)}</td>
                        <td className="py-3 px-3">
                          <Badge variant={inv.status} size="sm" dot>
                            {inv.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No fee invoices recorded for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXAMS TAB */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-50/60 rounded-xl border border-brand-100">
              <div>
                <span className="text-xs text-brand-700 font-semibold block">Academic Standing</span>
                <span className="text-base font-bold text-slate-900">Cumulative GPA: {student.gpa || 3.92} / 4.0</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-brand-600 text-white rounded-lg">
                Grade Rank: 2nd / 120
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Subject</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Score</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Grade</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-600">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentMarks.length > 0 ? (
                    studentMarks.map((m) => {
                      const gradeInfo = calculateGrade(m.marks_obtained);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {examSubjects.find((s) => s.id === m.exam_subject_id)?.subject_name || 'Academic Course'}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">{m.marks_obtained} / 100</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-xs ${gradeInfo.color}`}>
                              {m.grade || gradeInfo.grade}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 italic">{m.remarks || 'Commendable work'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        No examination scores entered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MEDICAL TAB */}
        {activeTab === 'medical' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 text-xs text-rose-900 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-rose-700">
                <HeartPulse className="w-4 h-4" /> Medical Health Notice
              </span>
              <p>
                <strong>Known Allergies:</strong> {student.medical_allergies || 'Penicillin, Peanuts (Mild)'}
              </p>
              <p>
                <strong>Medical Notes & Inhaler Protocol:</strong> {student.medical_conditions || 'Mild Asthma (Carries Inhaler)'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block">Emergency Contact Protocol</span>
              <p>Primary: {student.emergency_contact_name || student.parent_name} ({student.emergency_contact_relation || 'Parent'})</p>
              <p>Direct Hotline: <strong className="text-brand-600">{student.emergency_contact_phone || student.parent_phone}</strong></p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <Button variant="outline" onClick={onClose}>
          Close Profile
        </Button>
      </div>
    </Modal>
  );
};

