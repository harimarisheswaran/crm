import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { RecordPaymentModal } from '../../components/modals/RecordPaymentModal';
import { FeeReceiptModal } from '../../components/modals/FeeReceiptModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Calendar,
  Search,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const AccountantDashboard = () => {
  const { user } = useAuth();
  const { studentFees, feePayments } = useData();

  const [recordPaymentInvoice, setRecordPaymentInvoice] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const totalBilled = studentFees.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const totalCollected = studentFees.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const totalOutstanding = studentFees.reduce((acc, curr) => acc + Number(curr.due_amount || 0), 0);
  const overdueCount = studentFees.filter((f) => f.status === 'overdue').length;

  const paymentMethodData = [
    { method: 'Bank Wire / ACH', amount: 54000 },
    { method: 'Credit / Debit Card', amount: 38000 },
    { method: 'Online Gateway', amount: 42000 },
    { method: 'Cash Counter', amount: 12500 },
  ];

  return (
    <div className="space-y-6">
      {/* Bursar Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Bursar & Financial Accounting Office 💼
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as {user?.full_name || 'Clara Oswald'} • Chief Bursar & Financial Controller
          </p>
        </div>
      </div>

      {/* Financial Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Invoiced Revenue</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalBilled)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Annual term billing baseline</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Realized Collections</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{formatCurrency(totalCollected)}</span>
            <span className="text-xs font-semibold text-emerald-600">84% Collected</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Settled into operating account</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Receivables</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{formatCurrency(totalOutstanding)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Scheduled for Term 2 collection</p>
        </Card>

        <Card padding={false} className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Delinquent / Overdue</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">{overdueCount} Accounts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automated reminders dispatched</p>
        </Card>
      </div>

      {/* Revenue Inflow by Channel Chart */}
      <Card
        title="Fee Inflow Breakdown by Payment Channel"
        subtitle="Distribution across ACH, Cards, Portals, and Cash"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentMethodData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="method" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(v) => [formatCurrency(v), 'Revenue']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="amount" name="Collected Revenue" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Invoices & Direct Collection Table */}
      <Card
        title="Recent Invoices & Outstanding Dues"
        subtitle="Click 'Collect Fee' to record instantaneous cash/card payments"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Fee Title</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Paid Amount</th>
                <th className="py-2.5 px-3">Balance Due</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Collect Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentFees.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{inv.student_name}</td>
                  <td className="py-3 px-3 text-slate-700">{inv.title}</td>
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
                        onClick={() => setRecordPaymentInvoice(inv)}
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

      {/* Modals */}
      <RecordPaymentModal
        invoice={recordPaymentInvoice}
        isOpen={!!recordPaymentInvoice}
        onClose={() => setRecordPaymentInvoice(null)}
        onViewReceipt={(p) => setSelectedReceipt(p)}
      />

      <FeeReceiptModal
        payment={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

