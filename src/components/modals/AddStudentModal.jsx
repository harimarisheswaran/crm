import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Sparkles } from 'lucide-react';

export const AddStudentModal = ({ isOpen, onClose }) => {
  const { classes, sections, addStudent } = useData();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '2008-05-15',
    gender: 'Male',
    blood_group: 'O+',
    class_id: classes[0]?.id || 'cls-10',
    section_id: sections[0]?.id || 'sec-10A',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    father_occupation: '',
    mother_name: '',
    address: '',
    city: 'San Francisco',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: 'Parent',
    medical_allergies: 'None',
    medical_conditions: 'None',
    previous_school_name: '',
    previous_school_grade: '',
    photo_url: '',
  });

  const availableSections = sections.filter((s) => s.class_id === formData.class_id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) return;

    const selectedClass = classes.find((c) => c.id === formData.class_id);
    const selectedSection = sections.find((s) => s.id === formData.section_id);

    const newStudent = addStudent({
      ...formData,
      class_name: selectedClass?.name || 'Grade 10',
      section_name: selectedSection?.name || 'A',
      email: formData.email || `${formData.first_name.toLowerCase()}.${formData.last_name.toLowerCase()}@oakridge.edu`,
      photo_url: formData.photo_url || `https://images.unsplash.com/photo-${formData.gender === 'Female' ? '1534528741775-53994a69daeb' : '1539571696357-5a69c17a67c6'}?w=150&auto=format&fit=crop&q=80`,
    });

    success(`Student ${newStudent.full_name} enrolled successfully with ID #${newStudent.admission_number}!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Student"
      subtitle="Complete student registration and academic placement"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            1. Student Personal Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <Input
              label="First Name"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              placeholder="e.g. Benjamin"
            />
            <Input
              label="Last Name"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              placeholder="e.g. Hayes"
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Select
              label="Blood Group"
              value={formData.blood_group}
              onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
              ]}
            />
            <Input
              label="Student Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Auto-generated if empty"
            />
          </div>
        </div>

        {/* Academic Placement */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            2. Academic Placement
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Enrolled Class / Grade"
              required
              value={formData.class_id}
              onChange={(e) => {
                const newClassId = e.target.value;
                const newSecs = sections.filter((s) => s.class_id === newClassId);
                setFormData({
                  ...formData,
                  class_id: newClassId,
                  section_id: newSecs[0]?.id || '',
                });
              }}
              options={classes.map((c) => ({ value: c.id, label: c.name }))}
            />
            <Select
              label="Section Allocation"
              required
              value={formData.section_id}
              onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
              options={availableSections.map((s) => ({ value: s.id, label: `Section ${s.name} (${s.room_number})` }))}
            />
          </div>
        </div>

        {/* Parent & Emergency Details */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            3. Parent / Guardian & Emergency Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Primary Parent Name"
              required
              value={formData.parent_name}
              onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
              placeholder="e.g. Richard Hayes"
            />
            <Input
              label="Parent Phone"
              required
              value={formData.parent_phone}
              onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Parent Email"
              type="email"
              value={formData.parent_email}
              onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
              placeholder="parent@example.com"
            />
            <Input
              label="Residential Address"
              className="sm:col-span-2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address, Apartment/Suite"
            />
            <Input
              label="Emergency Phone"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
              placeholder="+1 (555) 999-9999"
            />
          </div>
        </div>

        {/* Health & Prior School */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            4. Medical & Prior School Background
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Known Medical Allergies"
              value={formData.medical_allergies}
              onChange={(e) => setFormData({ ...formData, medical_allergies: e.target.value })}
              placeholder="e.g. Peanuts, Penicillin, None"
            />
            <Input
              label="Previous School Name"
              value={formData.previous_school_name}
              onChange={(e) => setFormData({ ...formData, previous_school_name: e.target.value })}
              placeholder="e.g. St. Matthews Middle School"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={UserPlus}>
            Enroll Student
          </Button>
        </div>
      </form>
    </Modal>
  );
};

