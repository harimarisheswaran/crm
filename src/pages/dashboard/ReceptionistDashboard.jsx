import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AddStudentModal } from '../../components/modals/AddStudentModal';
import { StudentProfileModal } from '../../components/modals/StudentProfileModal';
import {
  UserCheck,
  Search,
  Plus,
  Users,
  CalendarCheck,
  Clock,
  PhoneCall,
  UserPlus,
} from 'lucide-react';

export const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const { students, attendance } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Visitor inquiries state
  const [visitorLogs, setVisitorLogs] = useState([
    { id: 'v-01', name: 'Jonathan Vance', purpose: 'Admissions Inquiry (Grade 6)', phone: '+1 (555) 948-2019', time: '09:15 AM', status: 'Checked In' },
    { id: 'v-02', name: 'Dr. Katherine Wells', purpose: 'Campus Health Inspection', phone: '+1 (555) 348-1102', time: '10:30 AM', status: 'Meeting in Progress' },
    { id: 'v-03', name: 'David Miller', purpose: 'Vendor Delivery (Science Labs)', phone: '+1 (555) 234-9988', time: '11:00 AM', status: 'Completed' },
  ]);

  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admission_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parent_phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Front Desk & Receptionist Portal 🛎️
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as {user?.full_name || 'Emily Thorne'} • Campus Welcome Center
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={UserPlus}
          onClick={() => setAddStudentOpen(true)}
        >
          New Admission Registration
        </Button>
      </div>

      {/* Reception KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Visitors</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-600">{visitorLogs.length} Checked In</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Security badges issued</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{students.length} Records</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">In campus database</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Inquiries</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">8 Inquiries</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Next session admissions</p>
        </Card>
      </div>

      {/* Quick Student Lookup Directory */}
      <Card
        title="Student Directory & Parent Contact Lookup"
        subtitle="Instantly search emergency phone numbers and class locations"
      >
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, admission number, or parent phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Admission No</th>
                <th className="py-2.5 px-3">Class & Section</th>
                <th className="py-2.5 px-3">Parent Name</th>
                <th className="py-2.5 px-3">Parent Phone</th>
                <th className="py-2.5 px-3">Emergency Contact</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.slice(0, 6).map((st) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{st.full_name}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{st.admission_number}</td>
                  <td className="py-3 px-3">{st.class_name}-{st.section_name}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{st.parent_name}</td>
                  <td className="py-3 px-3 font-semibold text-brand-600">{st.parent_phone}</td>
                  <td className="py-3 px-3 text-slate-600">{st.emergency_contact_phone || st.parent_phone}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(st)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      View Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visitor Log Table */}
      <Card
        title="Today's Campus Visitor Logs"
        subtitle="Front desk check-in register and gate pass records"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">Visitor Name</th>
                <th className="py-2.5 px-3">Purpose of Visit</th>
                <th className="py-2.5 px-3">Phone Contact</th>
                <th className="py-2.5 px-3">Check-in Time</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitorLogs.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{v.name}</td>
                  <td className="py-3 px-3 text-slate-700">{v.purpose}</td>
                  <td className="py-3 px-3 text-slate-600">{v.phone}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{v.time}</td>
                  <td className="py-3 px-3">
                    <Badge variant={v.status === 'Completed' ? 'success' : 'pending'} size="sm">
                      {v.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <AddStudentModal
        isOpen={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
      />

      <StudentProfileModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};

