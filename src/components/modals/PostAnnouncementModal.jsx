import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Megaphone } from 'lucide-react';

export const PostAnnouncementModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { postAnnouncement } = useData();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'all',
    importance: 'normal',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    postAnnouncement({
      ...formData,
      published_by: user?.full_name || 'School Administration',
    });

    success('Announcement published to targeted portals!');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post School Announcement"
      subtitle="Broadcast notifications to teachers, parents, or students"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Notice Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Winter Holiday Schedule & Examination Dates"
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Target Audience"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            options={[
              { value: 'all', label: 'All Community (Public)' },
              { value: 'parents', label: 'Parents Only' },
              { value: 'students', label: 'Students Only' },
              { value: 'teachers', label: 'Teachers & Faculty' },
            ]}
          />
          <Select
            label="Priority Level"
            value={formData.importance}
            onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High Priority' },
              { value: 'urgent', label: 'Urgent / Alert' },
            ]}
          />
        </div>

        <Textarea
          label="Notice Content & Details"
          required
          rows={4}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Type announcement message here..."
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Megaphone}>
            Publish Notice
          </Button>
        </div>
      </form>
    </Modal>
  );
};

