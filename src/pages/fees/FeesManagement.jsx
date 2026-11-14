import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { SearchFilter } from '../../components/common/SearchFilter';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';
import { FeeReceiptModal } from '../../components/modals/FeeReceiptModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  CreditCard,
  DollarSign,
  Plus,
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const FeesManagement = () => {
  const { studentFees, feeStructures, feePayments, students, classes, addFeeStructure, createStudentInvoice } = useData();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'structures' | 'payments'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [payInvoice, setPayInvoice] = useState(null);
  const [viewPayment, setViewPayment] = useState(null);
  const [createStructureOpen, setCreateStructureOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  // New Structure Form
  const [structTitle, setStructTitle] = useState('');
  const [structClass, setStructClass] = useState('All Classes');
  const [structType, setStructType] = useState('Tuition');
  const [structAmount, setStructAmount] = useState('1500');
  const [structFreq, setStructFreq] = useState('Termly');
  const [structLateFine, setStructLateFine] = useState('25');

  // New Invoice Form
  const [invStudentId, setInvStudentId] = useState(students[0]?.id || '');
  const [invTitle, setInvTitle] = useState('Term 2 Tuition & Activity Dues');
  const [invAmount, setInvAmount] = useState('2400');
  const [invDiscount, setInvDiscount] = useState('0');
  const [invDueDate, setInvDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );

  const handleCreateStructure = (e) => {
    e.preventDefault();
    if (!structTitle) return;

    addFeeStructure({
      title: structTitle,
      class_name: structClass,
      fee_type: structType,
      amount: Number(structAmount),
      frequency: structFreq,
      late_fine_amount: Number(structLateFine),
    });

    success(`Fee structure "${structTitle}" created!`);
    setCreateStructureOpen(false);
    setStructTitle('');
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === invStudentId);
    if (!st) return;

    createStudentInvoice({
      student_id: st.id,
      student_name: st.full_name,
      admission_number: st.admission_number,
      class_name: `${st.class_name}-${st.section_name}`,
      title: invTitle,
      total_amount: Number(invAmount),
      discount_amount: Number(invDiscount),
      due_date: invDueDate,
    });

    success(`Invoice issued to ${st.full_name}!`);
    setCreateInvoiceOpen(false);
  };

  // Metrics
  const totalBilled = studentFees.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const totalPaid = studentFees.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const totalDue = studentFees.reduce((acc, curr) => acc + Number(curr.due_amount || 0), 0);

  // Filtered invoices
  const filteredInvoices = studentFees.filter((inv) => {
    const matchesSearch =
      inv.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.title?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'invoices', label: 'Student Invoices', icon: Receipt, badge: filteredInvoices.length },
    { id: 'structures', label: 'Fee Structures & Catalog', icon: DollarSign, badge: feeStructures.length },
    { id: 'payments', label: 'Payment Receipts Log', icon: CreditCard, badge: feePayments.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Fees & Billing Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tuition fee schedules, student invoices, partial payments, receipts, and revenue collection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setCreateStructureOpen(true)}
          >
            New Fee Type
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setCreateInvoiceOpen(true)}
          >
            Issue Invoice
          </Button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Billed</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalBilled)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total academic term dues</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Collected</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{formatCurrency(totalPaid)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Settled & verified in accounts</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Receivables</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{formatCurrency(totalDue)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Due before next examination</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Delinquent Overdue</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">
              {studentFees.filter((f) => f.status === 'overdue').length} Accounts
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Subject to late fines</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search by student, invoice number, or fee title..."
            filters={[
              {
                id: 'status',
                options: [
                  { value: 'all', label: 'All Statuses' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'partially_paid', label: 'Partially Paid' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'overdue', label: 'Overdue' },
                ],
              },
            ]}
            filterValues={{ status: statusFilter }}
            onFilterChange={(id, val) => setStatusFilter(val)}
            onReset={() => {
              setSearch('');
              setStatusFilter('all');
            }}
          />

          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Fee Title</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Balance Due</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Collect Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{inv.student_name}</td>
                      <td className="py-3 px-4 text-slate-700">{inv.class_name}</td>
                      <td className="py-3 px-4 text-slate-800">{inv.title}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(inv.total_amount)}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">{formatCurrency(inv.paid_amount)}</td>
                      <td className="py-3 px-4 font-bold text-rose-600">{formatCurrency(inv.due_amount)}</td>
                      <td className="py-3 px-4 text-slate-600">{inv.due_date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={inv.status} size="sm" dot>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.due_amount > 0 ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => setPayInvoice(inv)}
                          >
                            Collect Fee
                          </Button>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* FEE STRUCTURES TAB */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeStructures.map((struct) => (
            <div
              key={struct.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary" size="sm">
                  {struct.fee_type}
                </Badge>
                <span className="text-xs font-semibold text-slate-500">{struct.frequency}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{struct.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Applies to: {struct.class_name}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Fee Amount</span>
                  <span className="text-lg font-extrabold text-slate-900">{formatCurrency(struct.amount)}</span>
                </div>
                {struct.late_fine_amount > 0 && (
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Late Fine</span>
                    <span className="text-xs font-bold text-rose-600">+{formatCurrency(struct.late_fine_amount)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAYMENT RECEIPTS LOG TAB */}
      {activeTab === 'payments' && (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Collected By</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-brand-600">{p.receipt_number}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.student_name}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600 text-sm">
                      {formatCurrency(p.amount_paid)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{p.payment_method}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{p.transaction_id || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{p.payment_date}</td>
                    <td className="py-3 px-4 text-slate-700">{p.collected_by}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Printer}
                        onClick={() => setViewPayment(p)}
                      >
                        Print
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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

      {/* New Structure Modal */}
      <Modal
        isOpen={createStructureOpen}
        onClose={() => setCreateStructureOpen(false)}
        title="Add Fee Structure"
        subtitle="Define new billing charge category for academic grades"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateStructure} className="space-y-4">
          <Input
            label="Fee Title"
            required
            value={structTitle}
            onChange={(e) => setStructTitle(e.target.value)}
            placeholder="e.g. Science & Lab Maintenance Fee"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Fee Category"
              value={structType}
              onChange={(e) => setStructType(e.target.value)}
              options={[
                { value: 'Tuition', label: 'Tuition' },
                { value: 'Admission', label: 'Admission' },
                { value: 'Transport', label: 'Transport' },
                { value: 'Examination', label: 'Examination' },
                { value: 'Library', label: 'Library' },
                { value: 'Laboratory', label: 'Laboratory' },
              ]}
            />
            <Select
              label="Billing Frequency"
              value={structFreq}
              onChange={(e) => setStructFreq(e.target.value)}
              options={[
                { value: 'Termly', label: 'Termly' },
                { value: 'Annually', label: 'Annually' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'One-Time', label: 'One-Time' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount ($)"
              type="number"
              required
              value={structAmount}
              onChange={(e) => setStructAmount(e.target.value)}
            />
            <Input
              label="Late Penalty ($)"
              type="number"
              value={structLateFine}
              onChange={(e) => setStructLateFine(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setCreateStructureOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Fee Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Issue Invoice Modal */}
      <Modal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
        title="Issue Student Fee Invoice"
        subtitle="Bill a student for tuition or extracurricular charges"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <Select
            label="Select Student"
            value={invStudentId}
            onChange={(e) => setInvStudentId(e.target.value)}
            options={students.map((s) => ({
              value: s.id,
              label: `${s.full_name} (${s.admission_number}) - ${s.class_name}`,
            }))}
          />
          <Input
            label="Invoice Title / Reason"
            required
            value={invTitle}
            onChange={(e) => setInvTitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Amount ($)"
              type="number"
              required
              value={invAmount}
              onChange={(e) => setInvAmount(e.target.value)}
            />
            <Input
              label="Scholarship / Discount ($)"
              type="number"
              value={invDiscount}
              onChange={(e) => setInvDiscount(e.target.value)}
            />
          </div>
          <Input
            label="Payment Due Date"
            type="date"
            required
            value={invDueDate}
            onChange={(e) => setInvDueDate(e.target.value)}
          />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setCreateInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Issue Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

