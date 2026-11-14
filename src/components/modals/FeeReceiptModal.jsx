import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Printer, Download, CheckCircle, School, ShieldCheck } from 'lucide-react';

export const FeeReceiptModal = ({ payment, isOpen, onClose }) => {
  const { school, studentFees, students } = useData();

  if (!payment) return null;

  const invoice = studentFees.find((f) => f.id === payment.student_fee_id) || {};
  const student = students.find((s) => s.id === payment.student_id) || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Payment Receipt"
      subtitle={`Receipt #${payment.receipt_number}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Printable Receipt Container */}
        <div
          id="printable-receipt"
          className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 print:border-none print:shadow-none print:p-0"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center text-white font-bold">
                <School className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900 tracking-tight">
                  {school?.name || 'Oakridge International Academy'}
                </h2>
                <p className="text-xs text-slate-500">{school?.address || '8500 Oakridge Parkway, San Francisco'}</p>
                <p className="text-xs text-slate-500">
                  Tel: {school?.phone} • Email: {school?.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg uppercase tracking-wider mb-1">
                PAID RECEIPT
              </span>
              <p className="text-xs font-mono font-bold text-slate-900">
                #{payment.receipt_number}
              </p>
              <p className="text-[11px] text-slate-500">{payment.payment_date}</p>
            </div>
          </div>

          {/* Student & Payment Meta */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl mb-4 text-xs">
            <div>
              <p className="text-slate-500 font-medium">Billed To:</p>
              <p className="font-bold text-slate-900 text-sm">{payment.student_name}</p>
              <p className="text-slate-600">Admission No: {student.admission_number || invoice.admission_number || 'ADM-2022-0489'}</p>
              <p className="text-slate-600">Class: {student.class_name || invoice.class_name || 'Grade 10-A'}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-medium">Payment Details:</p>
              <p className="text-slate-700 font-semibold">Method: {payment.payment_method}</p>
              <p className="font-mono text-slate-600 text-[11px]">Ref ID: {payment.transaction_id || 'N/A'}</p>
              <p className="text-slate-600">Collected By: {payment.collected_by}</p>
            </div>
          </div>

          {/* Line Item Table */}
          <table className="w-full text-xs text-left mb-4 border border-slate-200">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Invoice Ref</th>
                <th className="py-2.5 px-3 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-900 block">{invoice.title || 'Tuition & Academic Term Dues'}</span>
                  <span className="text-slate-500 text-[11px]">{payment.notes || 'School term fee collection'}</span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">{invoice.invoice_number || 'INV-2024'}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 text-sm">
                  {formatCurrency(payment.amount_paid)}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={2} className="py-2.5 px-3 text-right text-slate-700">
                  Total Amount Received:
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 text-base">
                  {formatCurrency(payment.amount_paid)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Balance info */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs mb-6">
            <span className="text-slate-600">Remaining Balance on this Invoice:</span>
            <span className="font-bold text-rose-600">
              {formatCurrency(invoice.due_amount || 0)}
            </span>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-end justify-between pt-6 border-t border-dashed border-slate-300">
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Computer Generated Receipt</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span className="text-[11px] text-slate-600 font-medium">Bursar Authorized Stamp</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 no-print">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print / Save as PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};

