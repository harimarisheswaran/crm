import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { calculateGrade } from '../../lib/utils';
import { Save, CheckCircle2 } from 'lucide-react';

export const MarksEntryModal = ({ examSubject, isOpen, onClose }) => {
  const { students, marks, saveSubjectMarks } = useData();
  const { success } = useToast();

  if (!examSubject) return null;

  // Filter students for this class
  const classStudents = students.filter((s) => s.class_id === examSubject.class_id);

  // Initialize marks state for these students
  const [entryData, setEntryData] = useState(() => {
    const map = {};
    classStudents.forEach((st) => {
      const existing = marks.find(
        (m) => m.exam_subject_id === examSubject.id && m.student_id === st.id
      );
      map[st.id] = {
        marks: existing ? existing.marks_obtained : '',
        remarks: existing ? existing.remarks : '',
      };
    });
    return map;
  });

  const handleMarkChange = (studentId, val) => {
    setEntryData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: val,
      },
    }));
  };

  const handleRemarksChange = (studentId, val) => {
    setEntryData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: val,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const records = [];
    classStudents.forEach((st) => {
      const val = entryData[st.id]?.marks;
      if (val !== '' && val !== undefined) {
        const numVal = Number(val);
        const gradeObj = calculateGrade(numVal, examSubject.max_marks || 100);
        records.push({
          exam_subject_id: examSubject.id,
          student_id: st.id,
          student_name: st.full_name,
          marks_obtained: numVal,
          grade: gradeObj.grade,
          remarks: entryData[st.id]?.remarks || 'Satisfactory work',
        });
      }
    });

    if (records.length === 0) return;

    saveSubjectMarks(records);
    success(`Successfully updated examination marks for ${records.length} students!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Examination Marks"
      subtitle={`${examSubject.subject_name} • Max Marks: ${examSubject.max_marks || 100} • Pass Marks: ${examSubject.pass_marks || 40}`}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Admission ID</th>
                <th className="py-2.5 px-3 w-28 text-center">Marks (/{examSubject.max_marks})</th>
                <th className="py-2.5 px-3 w-20 text-center">Grade</th>
                <th className="py-2.5 px-3">Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st) => {
                const currentMark = entryData[st.id]?.marks;
                const gradeInfo =
                  currentMark !== '' && currentMark !== undefined
                    ? calculateGrade(Number(currentMark), examSubject.max_marks)
                    : null;

                return (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{st.full_name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{st.admission_number}</td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={examSubject.max_marks || 100}
                        value={currentMark ?? ''}
                        onChange={(e) => handleMarkChange(st.id, e.target.value)}
                        placeholder="--"
                        className="w-20 text-center py-1.5 px-2 font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {gradeInfo ? (
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={entryData[st.id]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                        placeholder="Optional remarks..."
                        className="w-full py-1 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Save}>
            Save All Marks
          </Button>
        </div>
      </form>
    </Modal>
  );
};

