import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UploadCloud } from 'lucide-react';

export const SubmitHomeworkModal = ({ homework, isOpen, onClose }) => {
  const { user } = useAuth();
  const { submitHomework } = useData();
  const { success } = useToast();

  const [submissionText, setSubmissionText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  if (!homework) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    submitHomework({
      homework_id: homework.id,
      student_id: user?.id || 'std-001',
      student_name: user?.full_name || 'Liam Evans',
      submission_text: submissionText,
      attachment_url: attachmentUrl || 'homework_solution.pdf',
    });

    success('Assignment submitted successfully for teacher review!');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Assignment Solution"
      subtitle={`${homework.title} • ${homework.subject_name}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-700 block mb-1">Assignment Guidelines:</span>
          <p className="text-slate-600">{homework.description}</p>
        </div>

        <Textarea
          label="Your Notes / Solution Text"
          required
          rows={4}
          value={submissionText}
          onChange={(e) => setSubmissionText(e.target.value)}
          placeholder="Summarize your findings, formulas, or repository code link..."
        />

        <Input
          label="File Attachment / Link"
          value={attachmentUrl}
          onChange={(e) => setAttachmentUrl(e.target.value)}
          placeholder="e.g. Solution_Final_Doc.pdf or https://github.com/..."
          helperText="Upload files or paste external links to Google Drive, GitHub, etc."
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={UploadCloud}>
            Turn In Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

