import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { ApplyLeaveModal } from '../../components/modals/ApplyLeaveModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  UserCheck,
  Calendar,
  Check,
  X,
  Plus,
  Users,
  Building,
  DollarSign,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const StaffHRManagement = () => {
  const { staff, teachers, leaveRequests, updateLeaveStatus } = useData();
  const { user } = useAuth();
  const { success, warning } = useToast();

  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves' | 'directory' | 'payroll'
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false);

  // Review leave request modal
  const [reviewLeave, setReviewLeave] = useState(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  const handleApprove = (leaveId) => {
    updateLeaveStatus(leaveId, 'approved', reviewRemarks || 'Approved by Principal.', user?.full_name || 'Dr. Arthur Pendelton');
    success('Leave request approved.');
    setReviewLeave(null);
  };

  const handleReject = (leaveId) => {
    updateLeaveStatus(leaveId, 'rejected', reviewRemarks || 'Denied due to schedule conflicts.', user?.full_name || 'Dr. Arthur Pendelton');
    warning('Leave request rejected.');
    setReviewLeave(null);
  };

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');

  const tabs = [
    { id: 'leaves', label: 'Leave Applications & Approvals', icon: Calendar, badge: pendingLeaves.length },
    { id: 'directory', label: 'Non-Teaching Staff Directory', icon: Users, badge: staff.length },
    { id: 'payroll', label: 'Staff Payroll Overview', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Human Resources & Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Staff directory, department allocations, leave approvals workflow and payroll logs.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Calendar}
          onClick={() => setApplyLeaveOpen(true)}
        >
          Submit Leave Request
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* LEAVES TAB */}
      {activeTab === 'leaves' && (
        <Card
          title="Staff & Faculty Leave Requests"
          subtitle="Review and process administrative leave applications"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Role / Department</th>
                  <th className="py-2.5 px-3">Leave Type</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{leave.applicant_name}</td>
                    <td className="py-3 px-3 text-slate-600">{leave.applicant_role}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{leave.leave_type}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {leave.start_date} to {leave.end_date}
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-600">{leave.reason}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}
                        size="sm"
                        dot
                      >
                        {leave.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {leave.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="success"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApprove(leave.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={X}
                            onClick={() => handleReject(leave.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Processed by {leave.approved_by || 'Admin'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* DIRECTORY TAB */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map((stf) => (
            <div
              key={stf.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm"
            >
              <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {stf.employee_id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{stf.name}</h3>
              <p className="text-xs text-brand-600 font-semibold mt-0.5">{stf.designation}</p>
              <p className="text-xs text-slate-500 mt-0.5">Department: {stf.department}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                <p className="text-slate-600 truncate">Email: {stf.email}</p>
                <p className="text-slate-600">Phone: {stf.phone}</p>
                <p className="text-slate-900 font-bold mt-1">Salary: {formatCurrency(stf.salary)}/yr</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAYROLL OVERVIEW */}
      {activeTab === 'payroll' && (
        <Card
          title="Staff & Faculty Compensation Roster"
          subtitle="Monthly gross payroll expenditures and contracts"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Personnel Name</th>
                  <th className="py-2.5 px-3">ID #</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Annual Salary</th>
                  <th className="py-2.5 px-3 text-right">Monthly Gross</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...teachers, ...staff].map((person) => (
                  <tr key={person.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{person.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{person.employee_id}</td>
                    <td className="py-3 px-3 text-slate-700">{person.department}</td>
                    <td className="py-3 px-3 text-slate-600">{person.designation}</td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900">
                      {formatCurrency(person.salary || 60000)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600">
                      {formatCurrency((person.salary || 60000) / 12)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={applyLeaveOpen}
        onClose={() => setApplyLeaveOpen(false)}
      />
    </div>
  );
};

