import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchFilter } from '../../components/common/SearchFilter';
import { AddTeacherModal } from '../../components/modals/AddTeacherModal';
import { formatCurrency } from '../../lib/utils';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  BookOpen,
  Award,
  DollarSign,
  Trash2,
  Calendar,
} from 'lucide-react';

export const TeacherList = () => {
  const { teachers, deleteTeacher } = useData();
  const { success, warning } = useToast();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const departments = Array.from(new Set(teachers.map((t) => t.department).filter(Boolean)));

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
      t.department?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === 'all' || t.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove faculty record for ${name}?`)) {
      deleteTeacher(id);
      warning(`Faculty member ${name} removed.`);
    }
  };

  const columns = [
    {
      title: 'Faculty Member',
      key: 'name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar_url}
            alt={row.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
          />
          <div>
            <span className="font-bold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Teacher ID',
      key: 'employee_id',
      render: (val) => <span className="font-mono font-semibold text-slate-700">{val}</span>,
    },
    {
      title: 'Department & Role',
      key: 'department',
      render: (_, row) => (
        <div>
          <span className="font-semibold text-slate-800 block">{row.department}</span>
          <span className="text-[11px] text-slate-500">{row.designation}</span>
        </div>
      ),
    },
    {
      title: 'Assigned Subjects',
      key: 'subjects',
      render: (val) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {val && val.map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-semibold text-[11px] border border-brand-100">
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: 'Qualification',
      key: 'qualification',
      render: (val, row) => (
        <div>
          <span className="text-slate-800 font-medium block text-xs truncate max-w-xs">{val}</span>
          <span className="text-[11px] text-slate-400">{row.experience_years} years experience</span>
        </div>
      ),
    },
    {
      title: 'Annual Salary',
      key: 'salary',
      render: (val) => (
        <span className="font-semibold text-slate-900">{formatCurrency(val)}</span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant="success" size="sm" dot>
          {val || 'active'}
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
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove Record"
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
              Faculty & Teaching Staff
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {filteredTeachers.length} Professors
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage academic instructors, department assignments, experience, qualifications and compensation.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={UserPlus}
          onClick={() => setAddModalOpen(true)}
        >
          Add Faculty Member
        </Button>
      </div>

      {/* Filter toolbar */}
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search faculty by name, ID, or subject..."
        filters={[
          {
            id: 'dept',
            options: [
              { value: 'all', label: 'All Departments' },
              ...departments.map((d) => ({ value: d, label: d })),
            ],
          },
        ]}
        filterValues={{ dept: deptFilter }}
        onFilterChange={(id, val) => setDeptFilter(val)}
        onReset={() => {
          setSearch('');
          setDeptFilter('all');
        }}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={filteredTeachers}
        keyField="id"
        itemsPerPage={10}
        emptyTitle="No Teachers Found"
        emptyMessage="Try adjusting your department filter or add a new faculty member."
      />

      {/* Modal */}
      <AddTeacherModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
};

