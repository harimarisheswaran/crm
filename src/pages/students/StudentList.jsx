import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchFilter } from '../../components/common/SearchFilter';
import { AddStudentModal } from '../../components/modals/AddStudentModal';
import { StudentProfileModal } from '../../components/modals/StudentProfileModal';
import { ReportCardModal } from '../../components/modals/ReportCardModal';
import { exportToCSV, formatDate } from '../../lib/utils';
import {
  UserPlus,
  Download,
  Printer,
  Trash2,
  Eye,
  GraduationCap,
  Sparkles,
  School,
  FileSpreadsheet,
} from 'lucide-react';

export const StudentList = () => {
  const { students, classes, deleteStudent, examinations } = useData();
  const { success, warning } = useToast();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [reportCardStudent, setReportCardStudent] = useState(null);

  // Filters
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.parent_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());

    const matchesClass = classFilter === 'all' || s.class_id === classFilter;
    const matchesGender = genderFilter === 'all' || s.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesClass && matchesGender && matchesStatus;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to archive or remove student record for ${name}?`)) {
      deleteStudent(id);
      warning(`Student ${name} archived from active roster.`);
    }
  };

  const handleExport = () => {
    const exportData = filteredStudents.map((s) => ({
      'Admission No': s.admission_number,
      'Full Name': s.full_name,
      'Class': `${s.class_name}-${s.section_name}`,
      'Gender': s.gender,
      'Date of Birth': s.dob,
      'Parent Name': s.parent_name,
      'Parent Contact': s.parent_phone,
      'Emergency Phone': s.emergency_contact_phone,
      'Attendance Rate': `${s.attendance_rate || 96}%`,
      'Status': s.status,
    }));
    exportToCSV(exportData, `Students_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    success('Student roster exported to CSV successfully!');
  };

  const columns = [
    {
      title: 'Student Name',
      key: 'full_name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.photo_url}
            alt={row.full_name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
          />
          <div>
            <button
              type="button"
              onClick={() => setViewStudent(row)}
              className="font-bold text-slate-900 hover:text-brand-600 transition-colors text-left"
            >
              {row.full_name}
            </button>
            <span className="text-[11px] text-slate-400 block">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Admission ID',
      key: 'admission_number',
      render: (val) => <span className="font-mono font-semibold text-slate-700">{val}</span>,
    },
    {
      title: 'Class & Section',
      key: 'class_name',
      render: (_, row) => (
        <span className="font-semibold text-slate-800">
          {row.class_name} - {row.section_name}
        </span>
      ),
    },
    {
      title: 'Parent & Contact',
      key: 'parent_name',
      render: (_, row) => (
        <div>
          <span className="font-medium text-slate-800 block">{row.parent_name}</span>
          <span className="text-[11px] text-brand-600">{row.parent_phone}</span>
        </div>
      ),
    },
    {
      title: 'Gender / Blood',
      key: 'gender',
      render: (_, row) => (
        <span className="text-slate-600 text-xs">
          {row.gender} • <strong className="text-slate-800">{row.blood_group || 'O+'}</strong>
        </span>
      ),
    },
    {
      title: 'Attendance',
      key: 'attendance_rate',
      render: (val) => (
        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs border border-emerald-200">
          {val || 96.5}%
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'active' ? 'success' : 'default'} size="sm" dot>
          {val}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setViewStudent(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="View Full Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setReportCardStudent(row)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="View & Print Report Card"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id, row.full_name)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Archive Student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Student Directory & Admissions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete management of student profiles, enrollments, demographics and parent records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={handleExport}
          >
            Export to Excel/CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => setAddModalOpen(true)}
          >
            New Student Admission
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by student name, admission number, parent name, or email..."
        filters={[
          {
            id: 'class',
            options: [
              { value: 'all', label: 'All Classes' },
              ...classes.map((c) => ({ value: c.id, label: c.name })),
            ],
          },
          {
            id: 'gender',
            options: [
              { value: 'all', label: 'All Genders' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
            ],
          },
          {
            id: 'status',
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
        ]}
        filterValues={{
          class: classFilter,
          gender: genderFilter,
          status: statusFilter,
        }}
        onFilterChange={(id, val) => {
          if (id === 'class') setClassFilter(val);
          if (id === 'gender') setGenderFilter(val);
          if (id === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearch('');
          setClassFilter('all');
          setGenderFilter('all');
          setStatusFilter('all');
        }}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={filteredStudents}
        keyField="id"
        itemsPerPage={10}
        emptyTitle="No Students Found"
        emptyMessage="Try adjusting your search criteria or enroll a new student."
      />

      {/* Modals */}
      <AddStudentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <StudentProfileModal
        student={viewStudent}
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        onOpenReportCard={(st) => {
          setViewStudent(null);
          setReportCardStudent(st);
        }}
      />

      <ReportCardModal
        student={reportCardStudent}
        examination={examinations[0]}
        isOpen={!!reportCardStudent}
        onClose={() => setReportCardStudent(null)}
      />
    </div>
  );
};

