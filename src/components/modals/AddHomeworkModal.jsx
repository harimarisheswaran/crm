import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { FilePlus } from 'lucide-react';

export const AddHomeworkModal = ({ isOpen, onClose }) => {
  const { classes, sections, subjects, addHomework } = useData();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    class_id: classes[0]?.id || 'cls-10',
    section_id: sections[0]?.id || 'sec-10A',
    subject_id: subjects[0]?.id || 'sbj-01',
    title: '',
    description: '',
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    max_score: 100,
    attachment_name: 'Worksheet_Assignment.pdf',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const selectedClass = classes.find((c) => c.id === formData.class_id);
    const selectedSection = sections.find((s) => s.id === formData.section_id);
    const selectedSubj = subjects.find((s) => s.id === formData.subject_id);

    addHomework({
      ...formData,
      class_name: `${selectedClass?.name || 'Grade 10'}-${selectedSection?.name || 'A'}`,
      subject_name: selectedSubj?.name || 'Mathematics',
      assigned_by_name: 'Marcus Vance',
      max_score: Number(formData.max_score),
    });

    success(`Homework "${formData.title}" assigned successfully!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Homework Assignment"
      subtitle="Publish assignments and deadlines to class portals"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Class"
            value={formData.class_id}
            onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
            options={classes.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Select
            label="Section"
            value={formData.section_id}
            onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
            options={sections
              .filter((s) => s.class_id === formData.class_id)
              .map((s) => ({ value: s.id, label: `Section ${s.name}` }))}
          />
        </div>

        <Select
          label="Subject"
          value={formData.subject_id}
          onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
          options={subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }))}
        />

        <Input
          label="Assignment Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Calculus Chapter 5 Derivatives"
        />

        <Textarea
          label="Instructions & Description"
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed problem set requirements or prompt guidelines..."
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Due Date"
            type="date"
            required
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
          <Input
            label="Maximum Marks / Points"
            type="number"
            value={formData.max_score}
            onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
          />
        </div>

        <Input
          label="Resource / Attachment Name (Optional)"
          value={formData.attachment_name}
          onChange={(e) => setFormData({ ...formData, attachment_name: e.target.value })}
          placeholder="e.g. Problem_Set_Handout.pdf"
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={FilePlus}>
            Assign Homework
          </Button>
        </div>
      </form>
    </Modal>
  );
};

