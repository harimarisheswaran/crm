import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';
import { FeeReceiptModal } from '../../components/modals/FeeReceiptModal';
import { ReportCardModal } from '../../components/modals/ReportCardModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Printer,
  Mail,
  Phone,
  Sparkles,
  Award,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const { students, studentFees, feePayments, homework, marks, examinations, announcements } = useData();

  // Find all children belonging to this parent (Robert Evans usr-008)
  const myChildren = students.filter((s) => s.parent_name?.includes('Evans') || s.parent_id === 'usr-008');

  // Currently active selected child
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id || 'std-001');
  const activeChild = myChildren.find((c) => c.id === selectedChildId) || myChildren[0] || students[0];

  // Invoices and payments for this child
  const childInvoices = studentFees.filter((f) => f.student_id === activeChild?.id);
  const childPayments = feePayments.filter((p) => p.student_id === activeChild?.id);
  const pendingInvoices = childInvoices.filter((f) => f.status !== 'paid');

  // Child's homework
  const childHomework = homework.filter((h) => h.class_id === activeChild?.class_id);

  // Modals state
  const [payInvoice, setPayInvoice] = useState(null);
  const [viewPayment, setViewPayment] = useState(null);
  const [reportCardOpen, setReportCardOpen] = useState(false);
  const [contactTeacherOpen, setContactTeacherOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Parent Portal — {user?.full_name || 'Robert Evans'} 👨‍👧‍👦
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor your children's academic growth, daily attendance, fee settlements and teacher updates.
          </p>
        </div>

        {/* Children Switcher Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 pl-2 pr-1 hidden md:inline">Select Child:</span>
          {myChildren.map((child) => {
            const isSelected = child.id === activeChild?.id;
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <img
                  src={child.photo_url}
                  alt={child.full_name}
                  className="w-5 h-5 rounded-full object-cover border border-white"
                />
                <span>{child.first_name} ({child.class_name})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Child Summary Profile Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-navy-800 text-white shadow-lg">
        <img
          src={activeChild?.photo_url}
          alt={activeChild?.full_name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md flex-shrink-0"
        />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold">{activeChild?.full_name}</h2>
            <Badge variant="success" size="sm" dot>
              {activeChild?.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Admission ID: <span className="font-mono">{activeChild?.admission_number}</span> • {activeChild?.class_name}-{activeChild?.section_name} • Roll #{activeChild?.roll_number || '12'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-slate-300">
            <span>Attendance: <strong className="text-emerald-400">{activeChild?.attendance_rate || 96.5}%</strong></span>
            <span>•</span>
            <span>GPA: <strong className="text-brand-400">{activeChild?.gpa || 3.92} / 4.0</strong></span>
            <span>•</span>
            <span>Class Teacher: <strong>Marcus Vance</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={() => setReportCardOpen(true)}
          >
            Term Report Card
          </Button>
        </div>
      </div>

      {/* Quick Status Cards for Selected Child */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Standing</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{activeChild?.attendance_rate || 96.5}%</span>
            <span className="text-xs font-semibold text-emerald-600">Present</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Today marked: Present</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Term Fees</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">
              {formatCurrency(
                childInvoices.reduce((acc, curr) => acc + Number(curr.due_amount || 0), 0)
              )}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Term 2 installment due Dec 15</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Homework</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-600">{childHomework.length} Tasks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculus & CS due next week</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Standing</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">Rank 2nd</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Honors Roll Candidate</p>
        </Card>
      </div>

      {/* Fee Invoices & Payment Portal */}
      <Card
        title="Fee Invoices & Payment Records"
        subtitle={`Tuition and extracurricular invoices for ${activeChild?.first_name}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Fee Description</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Paid Amount</th>
                <th className="py-2.5 px-3">Balance Due</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {childInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{inv.title}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{formatCurrency(inv.total_amount)}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-600">{formatCurrency(inv.paid_amount)}</td>
                  <td className="py-3 px-3 font-bold text-rose-600">{formatCurrency(inv.due_amount)}</td>
                  <td className="py-3 px-3 text-slate-600">{inv.due_date}</td>
                  <td className="py-3 px-3">
                    <Badge variant={inv.status} size="sm" dot>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {inv.due_amount > 0 ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setPayInvoice(inv)}
                      >
                        Pay Online
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Payment Receipts */}
        {childPayments.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Official Payment Receipts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {childPayments.map((pay) => (
                <div
                  key={pay.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-900">{pay.receipt_number}</span>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      {formatCurrency(pay.amount_paid)} via {pay.payment_method} • {pay.payment_date}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Printer}
                    onClick={() => setViewPayment(pay)}
                  >
                    View Receipt
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Homework & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={`${activeChild?.first_name}'s Active Homework`}
          subtitle="Track assignments and submission progress"
        >
          <div className="space-y-3">
            {childHomework.map((hw) => (
              <div key={hw.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{hw.title}</span>
                  <Badge variant="pending" size="sm">{hw.subject_name}</Badge>
                </div>
                <p className="text-slate-600 line-clamp-1">{hw.description}</p>
                <div className="flex items-center justify-between mt-2 text-[11px]">
                  <span className="text-slate-400">Assigned by: {hw.assigned_by_name}</span>
                  <span className="font-semibold text-rose-600">Due: {hw.due_date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Campus Announcements"
          subtitle="Direct communications sent to parents"
        >
          <div className="space-y-3">
            {announcements.map((anc) => (
              <div key={anc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{anc.title}</span>
                  <Badge variant={anc.importance === 'urgent' ? 'danger' : 'primary'} size="sm">
                    {anc.importance}
                  </Badge>
                </div>
                <p className="text-slate-600">{anc.content}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Published: {anc.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <RecordPaymentModal
        invoice={payInvoice}
        isOpen={!!payInvoice}
        onClose={() => setPayInvoice(null)}
        onViewReceipt={(p) => setViewPayment(p)}
      />

      <FeeReceiptModal
        payment={viewPayment}
        isOpen={!!viewPayment}
        onClose={() => setViewPayment(null)}
      />

      <ReportCardModal
        student={activeChild}
        examination={examinations[0]}
        isOpen={reportCardOpen}
        onClose={() => setReportCardOpen(false)}
      />
    </div>
  );
};

