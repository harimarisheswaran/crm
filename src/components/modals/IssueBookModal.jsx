import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Select, Input } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { BookOpen } from 'lucide-react';

export const IssueBookModal = ({ book, isOpen, onClose }) => {
  const { students, issueBook } = useData();
  const { success } = useToast();

  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  if (!book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    if (!st) return;

    issueBook({
      book_id: book.id,
      book_title: book.title,
      student_id: st.id,
      student_name: st.full_name,
      due_date: dueDate,
    });

    success(`"${book.title}" successfully issued to ${st.full_name}!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Library Book"
      subtitle={`${book.title} • Available Copies: ${book.available_copies}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Student / Borrower"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          options={students.map((s) => ({
            value: s.id,
            label: `${s.full_name} (${s.admission_number}) - ${s.class_name}`,
          }))}
        />

        <Input
          label="Return Due Date"
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          helperText="Standard borrowing period is 14 days"
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={BookOpen}>
            Confirm Book Issue
          </Button>
        </div>
      </form>
    </Modal>
  );
};

