import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Calendar } from 'lucide-react';

export const ApplyLeaveModal = ({ isOpen, onClose }) => {
  const { user, roleInfo } = useAuth();
  const { applyLeave } = useData();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    leave_type: 'Casual Leave',
    start_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) return;

    applyLeave({
      ...formData,
      applicant_id: user?.id || 'usr-004',
      applicant_name: user?.full_name || 'Staff Member',
      applicant_role: roleInfo?.label || 'Staff',
    });

    success('Leave request submitted to administration for review.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Leave Application"
      subtitle="Submit formal leave request to Principal / HR"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Leave Type"
          value={formData.leave_type}
          onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
          options={[
            { value: 'Sick Leave', label: 'Sick Leave' },
            { value: 'Casual Leave', label: 'Casual Leave' },
            { value: 'Annual Leave', label: 'Annual Leave' },
            { value: 'Emergency', label: 'Emergency Family Leave' },
            { value: 'Maternity/Paternity', label: 'Maternity / Paternity' },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            required
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>

        <Textarea
          label="Reason for Absence"
          required
          rows={3}
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="State reason clearly for administrative record..."
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Calendar}>
            Submit Leave Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

