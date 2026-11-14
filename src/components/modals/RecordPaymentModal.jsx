import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../lib/utils';
import { CreditCard, CheckCircle2, Receipt } from 'lucide-react';

export const RecordPaymentModal = ({ invoice, isOpen, onClose, onViewReceipt }) => {
  const { recordFeePayment } = useData();
  const { success } = useToast();

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online Gateway');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  if (!invoice) return null;

  const dueAmount = invoice.due_amount || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payNum = Number(amount);
    if (!payNum || payNum <= 0) return;

    const payment = recordFeePayment({
      student_fee_id: invoice.id,
      student_id: invoice.student_id,
      student_name: invoice.student_name,
      amount_paid: payNum,
      payment_method: paymentMethod,
      transaction_id: transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: notes || `Payment collected for ${invoice.title}`,
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }

    success(`Payment of ${formatCurrency(payNum)} successfully logged! Receipt #${payment.receipt_number}`);
    onClose();

    if (onViewReceipt) {
      onViewReceipt(payment);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Fee Payment"
      subtitle={`Invoice #${invoice.invoice_number} • ${invoice.student_name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Invoice Summary Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Student:</span>
            <span className="font-semibold text-slate-800">{invoice.student_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fee Description:</span>
            <span className="font-semibold text-slate-800">{invoice.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Billed:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(invoice.total_amount)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-200 text-sm">
            <span className="font-bold text-slate-700">Remaining Balance:</span>
            <span className="font-bold text-rose-600">{formatCurrency(dueAmount)}</span>
          </div>
        </div>

        <div>
          <Input
            label="Payment Amount ($)"
            type="number"
            step="0.01"
            max={dueAmount}
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter amount up to $${dueAmount}`}
            helperText={`Quick fill: `}
          />
          <div className="flex items-center gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => setAmount(dueAmount.toString())}
              className="px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100"
            >
              Pay Full Due ({formatCurrency(dueAmount)})
            </button>
            {dueAmount > 100 && (
              <button
                type="button"
                onClick={() => setAmount((dueAmount / 2).toFixed(2))}
                className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200"
              >
                Pay 50% ({formatCurrency(dueAmount / 2)})
              </button>
            )}
          </div>
        </div>

        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={[
            { value: 'Online Gateway', label: 'Online Gateway (Stripe/PayPal)' },
            { value: 'Card', label: 'Debit / Credit Card (POS Terminal)' },
            { value: 'Bank Transfer', label: 'Bank Wire / ACH Transfer' },
            { value: 'Cash', label: 'Cash (Bursar Counter)' },
            { value: 'Cheque', label: 'Bank Cheque / Draft' },
          ]}
        />

        <Input
          label="Transaction / Reference ID (Optional)"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="e.g. TRX-9041289"
        />

        <Textarea
          label="Payment Remarks & Notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes for audit logs..."
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" icon={CreditCard}>
            Confirm Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

