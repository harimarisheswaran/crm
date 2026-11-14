import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import {
  BookOpen,
  Plus,
  Users,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  School,
  CheckCircle2,
} from 'lucide-react';

export const ClassManagement = () => {
  const { classes, sections, subjects, teachers, students, addClass, addSection } = useData();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'subjects'
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-10');

  // Form states
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('');
  const [newClassCapacity, setNewClassCapacity] = useState('40');

  const [newSecName, setNewSecName] = useState('C');
  const [newSecRoom, setNewSecRoom] = useState('Room 305');
  const [newSecTeacher, setNewSecTeacher] = useState(teachers[0]?.name || '');

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName) return;

    addClass({
      name: newClassName,
      numeric_grade: Number(newClassGrade) || 10,
      capacity: Number(newClassCapacity) || 40,
    });

    success(`Class "${newClassName}" created successfully!`);
    setNewClassName('');
    setAddClassOpen(false);
  };

  const handleCreateSection = (e) => {
    e.preventDefault();
    if (!newSecName) return;

    addSection({
      class_id: selectedClassId,
      name: newSecName,
      room_number: newSecRoom,
      class_teacher_name: newSecTeacher,
    });

    success(`Section "${newSecName}" created and assigned!`);
    setAddSectionOpen(false);
  };

  // Class-wise student roster for selected class
  const classStudents = students.filter((s) => s.class_id === selectedClassId);
  const classSections = sections.filter((s) => s.class_id === selectedClassId);
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Academic Classes, Sections & Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize school grades, classroom allocations, sections, and curricula subjects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setAddSectionOpen(true)}
          >
            Add Section
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddClassOpen(true)}
          >
            Create Class
          </Button>
        </div>
      </div>

      {/* Class Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          const studentCount = students.filter((s) => s.class_id === cls.id).length;

          return (
            <button
              key={cls.id}
              type="button"
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-3 rounded-2xl border text-left transition-all flex-shrink-0 min-w-[160px] ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{cls.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {studentCount} Students
                </span>
              </div>
              <span className={`text-[11px] block mt-1 ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                {cls.sections_count || 2} Sections • Cap: {cls.capacity || 40}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sections and Classroom Allocation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections for Selected Class (1 column) */}
        <Card
          title={`Sections in ${currentClass?.name}`}
          subtitle="Homeroom assignments and classroom teachers"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddSectionOpen(true)}
            >
              + Section
            </Button>
          }
        >
          <div className="space-y-3">
            {classSections.map((sec) => {
              const secStudents = classStudents.filter((s) => s.section_id === sec.id);
              return (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                        {sec.name}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">
                        Section {sec.name} ({sec.room_number})
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Class Mentor: <strong className="text-slate-700">{sec.class_teacher_name}</strong>
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {secStudents.length || 18} Students
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Enrolled Students in this Class (2 columns) */}
        <Card
          title={`Enrolled Students — ${currentClass?.name}`}
          subtitle={`Viewing ${classStudents.length} students enrolled in this academic grade`}
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.length > 0 ? (
                  classStudents.map((st) => (
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
                      <td className="py-3 px-3 font-mono font-medium text-slate-600">{st.admission_number}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">Section {st.section_name}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">#{st.roll_number || '12'}</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">{st.attendance_rate || 96.5}%</td>
                      <td className="py-3 px-3">
                        <Badge variant="active" size="sm" dot>
                          {st.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No students allocated to this class yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Curriculum Subject Catalog */}
      <Card
        title="Curriculum Subjects & Course Codes"
        subtitle="School subjects, credit units, and instructional departments"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((sbj) => (
            <div
              key={sbj.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  {sbj.code}
                </span>
                <Badge variant={sbj.type === 'Core' ? 'primary' : 'default'} size="sm">
                  {sbj.type}
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{sbj.name}</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Credits: <strong className="text-slate-800">{sbj.credits} Units</strong> • 5 Lectures / Week
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={addClassOpen}
        onClose={() => setAddClassOpen(false)}
        title="Create Academic Class"
        subtitle="Add a new grade tier to the school structure"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <Input
            label="Class Name"
            required
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="e.g. Grade 11 or Class 11"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Numeric Grade Level"
              type="number"
              value={newClassGrade}
              onChange={(e) => setNewClassGrade(e.target.value)}
              placeholder="e.g. 11"
            />
            <Input
              label="Student Capacity"
              type="number"
              value={newClassCapacity}
              onChange={(e) => setNewClassCapacity(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddClassOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Class
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        title="Add Class Section"
        subtitle={`Assign section to ${currentClass?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSection} className="space-y-4">
          <Input
            label="Section Identifier"
            required
            value={newSecName}
            onChange={(e) => setNewSecName(e.target.value)}
            placeholder="e.g. C, D, or Lotus"
          />
          <Input
            label="Assigned Classroom"
            value={newSecRoom}
            onChange={(e) => setNewSecRoom(e.target.value)}
            placeholder="e.g. Room 304, Science Wing"
          />
          <Select
            label="Class Teacher / Homeroom Mentor"
            value={newSecTeacher}
            onChange={(e) => setNewSecTeacher(e.target.value)}
            options={teachers.map((t) => ({ value: t.name, label: t.name }))}
          />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddSectionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Section
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

