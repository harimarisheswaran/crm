import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { UserPlus } from 'lucide-react';

export const AddTeacherModal = ({ isOpen, onClose }) => {
  const { addTeacher, subjects, classes } = useData();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Mathematics',
    designation: 'Subject Faculty',
    qualification: 'Master of Science',
    experience_years: 5,
    salary: 62000,
    contract_type: 'Permanent',
    joining_date: '2024-08-01',
    subjects: ['Mathematics'],
    classes_assigned: ['Grade 10-A'],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const teacher = addTeacher({
      ...formData,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@oakridge.edu`,
      phone: formData.phone || '+1 (555) 400-1122',
      salary: Number(formData.salary),
      experience_years: Number(formData.experience_years),
    });

    success(`Teacher ${teacher.name} registered successfully with ID #${teacher.employee_id}!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Faculty Member"
      subtitle="Register teaching staff and assign departments"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Dr. Robert Langdon"
          />
          <Input
            label="Official Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. robert.l@oakridge.edu"
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 234-5678"
          />
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'Science & Physics', label: 'Science & Physics' },
              { value: 'Humanities & English', label: 'Humanities & English' },
              { value: 'Technology & AI', label: 'Technology & AI' },
              { value: 'Social Sciences', label: 'Social Sciences' },
              { value: 'Languages & Arts', label: 'Languages & Arts' },
            ]}
          />
          <Input
            label="Designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            placeholder="e.g. Senior Lecturer"
          />
          <Input
            label="Highest Academic Qualification"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            placeholder="e.g. Ph.D. Applied Mathematics"
          />
          <Input
            label="Experience (Years)"
            type="number"
            min={0}
            value={formData.experience_years}
            onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
          />
          <Input
            label="Annual Compensation ($)"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
          <Select
            label="Contract Type"
            value={formData.contract_type}
            onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
            options={[
              { value: 'Permanent', label: 'Permanent' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Visiting', label: 'Visiting Faculty' },
            ]}
          />
          <Input
            label="Date of Joining"
            type="date"
            value={formData.joining_date}
            onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={UserPlus}>
            Save Faculty Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};

