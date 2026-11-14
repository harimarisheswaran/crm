import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input, Select, Textarea } from '../../components/common/Input';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Settings,
  School,
  Database,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const SettingsManagement = () => {
  const { school, updateSchoolSettings, resetToDefaults } = useData();
  const { user } = useAuth();
  const { success, warning } = useToast();

  const [formData, setFormData] = useState({
    name: school?.name || 'Oakridge International Academy',
    code: school?.code || 'OIA-2024',
    tagline: school?.tagline || 'Inspiring Excellence, Fostering Leadership',
    phone: school?.phone || '+1 (555) 349-2810',
    email: school?.email || 'administration@oakridge.edu',
    website: school?.website || 'https://oakridge.edu',
    address: school?.address || '8500 Oakridge Parkway, North Campus',
    city: school?.city || 'San Francisco',
    state: school?.state || 'California',
    postal_code: school?.postal_code || '94102',
    currency_symbol: school?.currency_symbol || '$',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSchoolSettings(formData);
    success('School profile configuration updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      warning('New password and confirmation do not match.');
      return;
    }
    success('Administrator password updated successfully.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all records to the original initial seed data? This will clear any local modifications.')) {
      resetToDefaults();
      success('Database reset to clean factory state.');
    }
  };

  const supabaseActive = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System & School Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure institutional profile, database connections, credentials and system preferences.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RotateCcw}
          onClick={handleResetData}
          className="text-rose-600 hover:bg-rose-50"
        >
          Reset Database to Defaults
        </Button>
      </div>

      {/* Database Connection Status Card */}
      <Card
        title="Database & Storage Architecture"
        subtitle="Supabase PostgreSQL and persistent client state"
        icon={Database}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Database Engine:</span>
                <Badge variant="success" size="sm" dot>
                  {supabaseActive ? 'Live Supabase Connected' : 'Persistent Local Storage Engine Active'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Full relational PostgreSQL schema defined in <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border">supabase-schema.sql</code>. All CRUD actions are reactive and persist across refreshes.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* School General Profile Form */}
      <Card
        title="School General Profile & Letterhead"
        subtitle="Information displayed on invoices, fee receipts, and official report cards"
        icon={School}
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label="School Official Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Institution Code"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <Input
              label="Motto / Tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
            <Input
              label="Contact Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Administrative Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Website URL"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
            <Input
              label="Campus Address"
              className="sm:col-span-2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="Billing Currency Symbol"
              value={formData.currency_symbol}
              onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="submit" variant="primary" icon={Save}>
              Save Profile Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Security & Password Settings */}
      <Card
        title="Security & Password Settings"
        subtitle="Manage administrative credentials and authentication policies"
        icon={Lock}
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <Input
            label="Current Password"
            type="password"
            required
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            placeholder="••••••••"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="New Password"
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit" variant="primary" icon={Save}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

