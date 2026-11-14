import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { calculateGrade, formatDate } from '../../lib/utils';
import { Printer, School, Award, CheckCircle2 } from 'lucide-react';

export const ReportCardModal = ({ student, examination, isOpen, onClose }) => {
  const { school, marks, examSubjects } = useData();

  if (!student) return null;

  const examName = examination?.name || 'Fall Semester Midterm Examinations 2024';

  // Filter marks for this student
  const studentMarks = marks.filter((m) => m.student_id === student.id);

  // Calculate totals
  let totalMax = 0;
  let totalObtained = 0;

  const subjectRows = studentMarks.map((m) => {
    const subj = examSubjects.find((s) => s.id === m.exam_subject_id) || {};
    const maxMarks = subj.max_marks || 100;
    const obtained = m.marks_obtained || 0;
    totalMax += Number(maxMarks);
    totalObtained += Number(obtained);
    const gradeObj = calculateGrade(obtained, maxMarks);
    return {
      subject_name: subj.subject_name || 'Academic Subject',
      code: subj.subject_id || 'CRS-01',
      max_marks: maxMarks,
      obtained,
      grade: m.grade || gradeObj.grade,
      gpa: gradeObj.gpa,
      remarks: m.remarks || 'Commendable performance',
    };
  });

  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;
  const overallGrade = calculateGrade(totalObtained, totalMax);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Official Report Card"
      subtitle={`${student.full_name} • ${examName}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Printable Report Card Area */}
        <div
          id="printable-report-card"
          className="p-8 bg-white border-2 border-slate-300 rounded-2xl shadow-sm text-slate-800 print:border-none print:shadow-none print:p-0"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-navy-900 pb-5 mb-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-navy-900 flex items-center justify-center text-white mb-2 shadow-md">
              <School className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900 tracking-tight uppercase">
              {school?.name || 'Oakridge International Academy'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {school?.address || '8500 Oakridge Parkway, North Campus, San Francisco, CA'}
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-brand-50 border border-brand-200 text-brand-800 rounded-full text-xs font-bold uppercase tracking-wider">
              {examName} — Official Grade Transcript
            </div>
          </div>

          {/* Student Demographics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl mb-6 text-xs border border-slate-200/80">
            <div>
              <span className="text-slate-400 block font-medium">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{student.full_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Admission ID:</span>
              <span className="font-bold text-slate-900 font-mono">{student.admission_number}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Class & Section:</span>
              <span className="font-bold text-slate-900">{student.class_name} - Section {student.section_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Roll Number:</span>
              <span className="font-bold text-slate-900">{student.roll_number || '12'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Academic Year:</span>
              <span className="font-bold text-slate-900">{student.academic_year || '2024 - 2025'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Attendance Rate:</span>
              <span className="font-bold text-emerald-700">{student.attendance_rate || 96.5}%</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Issue Date:</span>
              <span className="font-bold text-slate-900">{formatDate(new Date())}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Class Standing:</span>
              <span className="font-bold text-brand-700">Rank 2nd / 120</span>
            </div>
          </div>

          {/* Subject Grade Table */}
          <table className="w-full text-xs text-left mb-6 border border-slate-200">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-2.5 px-3">Subject Name</th>
                <th className="py-2.5 px-3 text-center">Max Marks</th>
                <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3 text-center">GPA</th>
                <th className="py-2.5 px-3">Teacher Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectRows.length > 0 ? (
                subjectRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{row.subject_name}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.max_marks}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{row.obtained}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-bold text-xs bg-slate-100 text-slate-800">
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{row.gpa.toFixed(1)}</td>
                    <td className="py-3 px-3 text-slate-600 italic text-[11px]">{row.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No examination records found for this assessment.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
              <tr>
                <td className="py-3 px-3 text-slate-800">Grand Total & Summary:</td>
                <td className="py-3 px-3 text-center text-slate-700">{totalMax}</td>
                <td className="py-3 px-3 text-center text-brand-700 text-sm font-extrabold">{totalObtained}</td>
                <td className="py-3 px-3 text-center text-emerald-700 text-sm">{overallGrade.grade}</td>
                <td className="py-3 px-3 text-center text-slate-800">3.92</td>
                <td className="py-3 px-3 text-emerald-700 font-semibold">Promoted with Distinction</td>
              </tr>
            </tfoot>
          </table>

          {/* Performance Summary Statistics */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-brand-50/50 rounded-xl border border-brand-100 mb-8 text-center text-xs">
            <div>
              <span className="text-slate-500 block">Overall Percentage</span>
              <span className="text-lg font-bold text-slate-900">{percentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cumulative GPA</span>
              <span className="text-lg font-bold text-brand-600">3.92 / 4.0</span>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Result</span>
              <span className="text-lg font-bold text-emerald-600">Passed (Distinction)</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-300 text-center text-xs text-slate-600">
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                Marcus Vance
              </div>
              <span>Class Teacher</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                Dr. Arthur Pendelton
              </div>
              <span>Principal</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                [ Oakridge Official Seal ]
              </div>
              <span>Academic Registrar</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 no-print">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print Official Report Card
          </Button>
        </div>
      </div>
    </Modal>
  );
};

