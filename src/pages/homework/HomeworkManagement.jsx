import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AddHomeworkModal } from '../../components/modals/AddHomeworkModal';
import { SubmitHomeworkModal } from '../../components/modals/SubmitHomeworkModal';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  FileCheck,
  Send,
  Sparkles,
  Download,
} from 'lucide-react';

export const HomeworkManagement = () => {
  const { homework, homeworkSubmissions, gradeSubmission } = useData();
  const { success } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitModalHw, setSubmitModalHw] = useState(null);
  const [viewSubmissionsHw, setViewSubmissionsHw] = useState(null);

  // Grade modal state
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeScore, setGradeScore] = useState('95');
  const [gradeFeedback, setGradeFeedback] = useState('Well presented calculations.');

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeSubmission(
      gradingSubmission.id,
      Number(gradeScore),
      gradeFeedback,
      'Marcus Vance'
    );

    success(`Submission for ${gradingSubmission.student_name} graded!`);
    setGradingSubmission(null);
  };

  const currentSubmissions = homeworkSubmissions.filter(
    (s) => s.homework_id === viewSubmissionsHw?.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Homework & Academic Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign problem sets, collect digital turn-ins, evaluate solutions and return feedback.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setAddModalOpen(true)}
        >
          Create Assignment
        </Button>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homework.map((hw) => {
          const subs = homeworkSubmissions.filter((s) => s.homework_id === hw.id);

          return (
            <div
              key={hw.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="primary" size="sm">
                    {hw.subject_name}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">{hw.class_name}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{hw.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {hw.description}
                </p>

                {hw.attachment_name && (
                  <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="truncate">{hw.attachment_name}</span>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400">Due: <strong className="text-rose-600">{hw.due_date}</strong></span>
                  <span className="font-bold text-brand-600">{hw.submissions_count || subs.length || 24} Turn-ins</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setViewSubmissionsHw(hw)}
                  >
                    View Turn-ins
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSubmitModalHw(hw)}
                  >
                    Turn In
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Submissions Modal */}
      <Modal
        isOpen={!!viewSubmissionsHw}
        onClose={() => setViewSubmissionsHw(null)}
        title="Student Homework Submissions"
        subtitle={`${viewSubmissionsHw?.title} • Max Score: ${viewSubmissionsHw?.max_score} pts`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Submission Details</th>
                  <th className="py-2.5 px-3">Turn-in Date</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentSubmissions.length > 0 ? (
                  currentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{sub.student_name}</td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-slate-700 truncate">{sub.submission_text}</p>
                        {sub.attachment_url && (
                          <span className="text-[11px] text-brand-600 block mt-0.5">
                            Attachment: {sub.attachment_url}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{sub.submitted_at}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {sub.score !== null ? `${sub.score} / 100` : '--'}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={sub.status === 'graded' ? 'success' : 'pending'} size="sm">
                          {sub.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGradingSubmission(sub)}
                        >
                          Grade
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No submissions recorded for this assignment yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Grade Submission Modal */}
      <Modal
        isOpen={!!gradingSubmission}
        onClose={() => setGradingSubmission(null)}
        title="Grade Assignment Submission"
        subtitle={`Student: ${gradingSubmission?.student_name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveGrade} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 block">Student Answer:</span>
            <p className="font-medium text-slate-800 mt-1">{gradingSubmission?.submission_text}</p>
          </div>

          <Input
            label="Score (out of 100)"
            type="number"
            min={0}
            max={100}
            required
            value={gradeScore}
            onChange={(e) => setGradeScore(e.target.value)}
          />

          <Textarea
            label="Teacher Feedback"
            rows={3}
            value={gradeFeedback}
            onChange={(e) => setGradeFeedback(e.target.value)}
            placeholder="Feedback on notation, methodology, or strengths..."
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setGradingSubmission(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Grade & Feedback
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modals */}
      <AddHomeworkModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <SubmitHomeworkModal
        homework={submitModalHw}
        isOpen={!!submitModalHw}
        onClose={() => setSubmitModalHw(null)}
      />
    </div>
  );
};

