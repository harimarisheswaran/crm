import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { PostAnnouncementModal } from '../../components/modals/PostAnnouncementModal';
import { formatDate } from '../../lib/utils';
import {
  Megaphone,
  Plus,
  Send,
  Mail,
  MessageSquare,
  Users,
  Bell,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const CommunicationManagement = () => {
  const { announcements, notifications } = useData();
  const { success } = useToast();

  const [postNoticeOpen, setPostNoticeOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState('all');

  // SMS Simulator State
  const [smsTarget, setSmsTarget] = useState('All Parents');
  const [smsMessage, setSmsMessage] = useState('Oakridge Notice: Term 2 examinations commence on Dec 10th.');

  const handleSendSMS = (e) => {
    e.preventDefault();
    if (!smsMessage) return;
    success(`SMS Broadcast dispatched to ${smsTarget} via Twilio Gateway simulator!`);
    setSmsMessage('');
  };

  const filteredAnnouncements = announcements.filter(
    (a) => selectedAudience === 'all' || a.audience === selectedAudience || a.audience === 'all'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Communications, Notice Board & SMS Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish school announcements, dispatch SMS text alerts, and send automated notifications.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setPostNoticeOpen(true)}
        >
          Post New Notice
        </Button>
      </div>

      {/* Main Notice Board & SMS Gateway */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Notices Board (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-brand-600" />
              Official Campus Announcements
            </h2>

            {/* Audience filter */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              {['all', 'parents', 'students', 'teachers'].map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setSelectedAudience(aud)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                    selectedAudience === aud
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAnnouncements.map((anc) => (
              <div
                key={anc.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        anc.importance === 'urgent'
                          ? 'danger'
                          : anc.importance === 'high'
                          ? 'warning'
                          : 'primary'
                      }
                      size="sm"
                    >
                      {anc.importance} Priority
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500 capitalize">
                      Target: {anc.audience}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{anc.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{anc.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{anc.content}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Published by: <strong className="text-slate-700">{anc.published_by}</strong></span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Send className="w-3 h-3" /> Dispatched
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Gateway & Notifications Center (1 column) */}
        <div className="space-y-6">
          {/* SMS Broadcast Tool */}
          <Card
            title="Instant SMS / Text Gateway"
            subtitle="Broadcast emergency alerts to parent/faculty mobiles"
            icon={MessageSquare}
          >
            <form onSubmit={handleSendSMS} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Audience
                </label>
                <select
                  value={smsTarget}
                  onChange={(e) => setSmsTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="All Parents">All Enrolled Parents (120 Numbers)</option>
                  <option value="All Teachers">All Faculty Members (18 Numbers)</option>
                  <option value="Grade 10 Parents">Grade 10 Parents Only</option>
                  <option value="Emergency Broadcast">Full Campus (All Staff & Parents)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SMS Text Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type urgent SMS update..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <Button type="submit" variant="primary" size="sm" icon={Send} className="w-full">
                Send SMS Broadcast
              </Button>
            </form>
          </Card>

          {/* In-App Notifications Feed */}
          <Card
            title="Recent In-App Notifications"
            subtitle="Automated system and event notifications"
            icon={Bell}
          >
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{notif.title}</span>
                    <Badge variant={notif.type} size="sm">{notif.type}</Badge>
                  </div>
                  <p className="text-slate-600">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">{notif.created_at}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <PostAnnouncementModal
        isOpen={postNoticeOpen}
        onClose={() => setPostNoticeOpen(false)}
      />
    </div>
  );
};

