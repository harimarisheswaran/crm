import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';

// Layout & Route Guards
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Dashboard Pages
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { ParentDashboard } from './pages/dashboard/ParentDashboard';
import { AccountantDashboard } from './pages/dashboard/AccountantDashboard';
import { ReceptionistDashboard } from './pages/dashboard/ReceptionistDashboard';

// Module Pages
import { StudentList } from './pages/students/StudentList';
import { TeacherList } from './pages/teachers/TeacherList';
import { ClassManagement } from './pages/classes/ClassManagement';
import { AttendanceManagement } from './pages/attendance/AttendanceManagement';
import { FeesManagement } from './pages/fees/FeesManagement';
import { ExaminationManagement } from './pages/examinations/ExaminationManagement';
import { TimetableManagement } from './pages/timetables/TimetableManagement';
import { HomeworkManagement } from './pages/homework/HomeworkManagement';
import { LibraryManagement } from './pages/library/LibraryManagement';
import { TransportManagement } from './pages/transport/TransportManagement';
import { StaffHRManagement } from './pages/staff/StaffHRManagement';
import { CommunicationManagement } from './pages/communication/CommunicationManagement';
import { ReportsAnalytics } from './pages/reports/ReportsAnalytics';
import { SettingsManagement } from './pages/settings/SettingsManagement';

// Dynamic Role Redirection Component
const RoleBasedHome = () => {
  const { role } = useAuth();
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  if (role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (role === 'parent') return <Navigate to="/parent/dashboard" replace />;
  if (role === 'accountant') return <Navigate to="/accountant/dashboard" replace />;
  if (role === 'receptionist') return <Navigate to="/receptionist/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  {/* Dynamic Home Redirect */}
                  <Route path="/" element={<RoleBasedHome />} />

                  {/* Dashboards */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/parent/dashboard" element={<ParentDashboard />} />
                  <Route path="/accountant/dashboard" element={<AccountantDashboard />} />
                  <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />

                  {/* Core ERP Modules */}
                  <Route path="/students" element={<StudentList />} />
                  <Route path="/teachers" element={<TeacherList />} />
                  <Route path="/classes" element={<ClassManagement />} />
                  <Route path="/attendance" element={<AttendanceManagement />} />
                  <Route path="/fees" element={<FeesManagement />} />
                  <Route path="/examinations" element={<ExaminationManagement />} />
                  <Route path="/timetables" element={<TimetableManagement />} />
                  <Route path="/homework" element={<HomeworkManagement />} />
                  <Route path="/library" element={<LibraryManagement />} />
                  <Route path="/transport" element={<TransportManagement />} />
                  <Route path="/staff" element={<StaffHRManagement />} />
                  <Route path="/communication" element={<CommunicationManagement />} />
                  <Route path="/reports" element={<ReportsAnalytics />} />
                  <Route path="/settings" element={<SettingsManagement />} />
                </Route>
              </Route>

              {/* Catch-all Wildcard Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

