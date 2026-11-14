import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { MarksEntryModal } from '../../components/modals/MarksEntryModal';
import { ReportCardModal } from '../../components/modals/ReportCardModal';
import { calculateGrade, formatDate } from '../../lib/utils';
import {
  Award,
  Calendar,
  Clock,
  Plus,
  Printer,
  Edit3,
  CheckCircle2,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const ExaminationManagement = () => {
  const { examinations, examSubjects, students, marks, addExamination } = useData();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('schedules'); // 'schedules' | 'report_cards' | 'performance'
  const [selectedExamId, setSelectedExamId] = useState(examinations[0]?.id || 'exm-01');

  // Modals state
  const [addExamOpen, setAddExamOpen] = useState(false);
  const [entrySubject, setEntrySubject] = useState(null);
  const [reportCardStudent, setReportCardStudent] = useState(null);

  // New Exam Form
  const [examName, setExamName] = useState('');
  const [examTerm, setExamTerm] = useState('Fall Term');
  const [examStart, setExamStart] = useState('2024-12-10');
  const [examEnd, setExamEnd] = useState('2024-12-20');

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!examName) return;

    addExamination({
      name: examName,
      term: examTerm,
      start_date: examStart,
      end_date: examEnd,
      status: 'upcoming',
    });

    success(`Examination "${examName}" created!`);
    setAddExamOpen(false);
    setExamName('');
  };

  const currentExam = examinations.find((e) => e.id === selectedExamId) || examinations[0];
  const examSubjectList = examSubjects.filter((s) => s.examination_id === selectedExamId);

  const tabs = [
    { id: 'schedules', label: 'Examination Schedules & Marks Entry', icon: Calendar },
    { id: 'report_cards', label: 'Report Cards Generator', icon: Printer },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Examinations & Academic Grading
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exam scheduling, subject-wise score logging, automated GPA grading and official report cards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddExamOpen(true)}
          >
            Create Examination
          </Button>
        </div>
      </div>

      {/* Examination Selector Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {examinations.map((ex) => {
          const isSelected = ex.id === selectedExamId;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => setSelectedExamId(ex.id)}
              className={`px-4 py-3 rounded-2xl border text-left transition-all min-w-[220px] ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs truncate">{ex.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ex.status}
                </span>
              </div>
              <span className={`text-[11px] block ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                {ex.term} • {formatDate(ex.start_date)} - {formatDate(ex.end_date)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* SCHEDULES & MARKS ENTRY TAB */}
      {activeTab === 'schedules' && (
        <Card
          title={`Exam Schedule & Scoring — ${currentExam?.name}`}
          subtitle="Click 'Enter Marks' to log student test scores and compute letter grades"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Time Window</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Pass Marks</th>
                  <th className="py-2.5 px-3">Room / Venue</th>
                  <th className="py-2.5 px-3 text-right">Marks Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examSubjectList.map((subj) => (
                  <tr key={subj.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{subj.subject_name}</td>
                    <td className="py-3 px-3 text-slate-700">{subj.exam_date}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {subj.start_time} - {subj.end_time}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{subj.max_marks}</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-600">{subj.pass_marks}</td>
                    <td className="py-3 px-3 text-slate-600">{subj.room_number}</td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Edit3}
                        onClick={() => setEntrySubject(subj)}
                      >
                        Enter Marks
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* REPORT CARDS GENERATOR TAB */}
      {activeTab === 'report_cards' && (
        <Card
          title="Student Grade Roster & Official Report Card Generator"
          subtitle="Generate and print comprehensive grade reports for students"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3 text-center">Marks Logged</th>
                  <th className="py-2.5 px-3 text-center">GPA Standing</th>
                  <th className="py-2.5 px-3 text-center">Class Rank</th>
                  <th className="py-2.5 px-3 text-right">Report Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st, idx) => {
                  const stMarks = marks.filter((m) => m.student_id === st.id);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={st.photo_url}
                            alt={st.full_name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-bold text-slate-900">{st.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{st.admission_number}</td>
                      <td className="py-3 px-3">{st.class_name}-{st.section_name}</td>
                      <td className="py-3 px-3 text-center font-bold text-brand-600">
                        {stMarks.length} / 5 Subjects
                      </td>
                      <td className="py-3 px-3 text-center font-extrabold text-slate-800">
                        {st.gpa || 3.92} / 4.0
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Printer}
                          onClick={() => setReportCardStudent(st)}
                        >
                          Print Report
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <MarksEntryModal
        examSubject={entrySubject}
        isOpen={!!entrySubject}
        onClose={() => setEntrySubject(null)}
      />

      <ReportCardModal
        student={reportCardStudent}
        examination={currentExam}
        isOpen={!!reportCardStudent}
        onClose={() => setReportCardStudent(null)}
      />

      {/* Create Exam Modal */}
      <Modal
        isOpen={addExamOpen}
        onClose={() => setAddExamOpen(false)}
        title="Schedule New Examination"
        subtitle="Create examination window and publish term assessment"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <Input
            label="Examination Name"
            required
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. Winter Academic Unit Assessment 2"
          />
          <Select
            label="Term"
            value={examTerm}
            onChange={(e) => setExamTerm(e.target.value)}
            options={[
              { value: 'Fall Term', label: 'Fall Term' },
              { value: 'Winter Term', label: 'Winter Term' },
              { value: 'Spring Term', label: 'Spring Term' },
              { value: 'Annual Final', label: 'Annual Final' },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              required
              value={examStart}
              onChange={(e) => setExamStart(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={examEnd}
              onChange={(e) => setExamEnd(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddExamOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Exam
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

