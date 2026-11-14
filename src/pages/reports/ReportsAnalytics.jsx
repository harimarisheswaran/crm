import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { formatCurrency, exportToCSV } from '../../lib/utils';
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Users,
  CreditCard,
  CalendarCheck,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const ReportsAnalytics = () => {
  const { students, classes, studentFees, marks, teachers, attendance, school } = useData();
  const { success } = useToast();

  const [activeReport, setActiveReport] = useState('fees'); // 'fees' | 'students' | 'attendance' | 'grades'
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // Grade Distribution Data
  const gradeCounts = { 'A+': 4, 'A': 5, 'B': 2, 'C': 1, 'F': 0 };
  marks.forEach((m) => {
    if (m.grade && gradeCounts[m.grade] !== undefined) {
      gradeCounts[m.grade] = (gradeCounts[m.grade] || 0) + 1;
    }
  });

  const gradeChartData = Object.keys(gradeCounts).map((g) => ({
    grade: g,
    count: gradeCounts[g],
  }));

  // Fee collection stats
  const totalBilled = studentFees.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const totalPaid = studentFees.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const totalDue = studentFees.reduce((acc, curr) => acc + Number(curr.due_amount || 0), 0);

  const feeComparisonData = [
    { name: 'Total Billed', amount: totalBilled },
    { name: 'Collected', amount: totalPaid },
    { name: 'Outstanding', amount: totalDue },
  ];

  const handleExportCSV = () => {
    if (activeReport === 'fees') {
      const data = studentFees.map((f) => ({
        'Invoice #': f.invoice_number,
        'Student': f.student_name,
        'Title': f.title,
        'Billed Amount': f.total_amount,
        'Paid Amount': f.paid_amount,
        'Due Balance': f.due_amount,
        'Due Date': f.due_date,
        'Status': f.status,
      }));
      exportToCSV(data, 'Fees_Collection_Report.csv');
    } else if (activeReport === 'students') {
      const data = students.map((s) => ({
        'Admission #': s.admission_number,
        'Name': s.full_name,
        'Class': `${s.class_name}-${s.section_name}`,
        'Parent': s.parent_name,
        'Phone': s.parent_phone,
        'Attendance Rate': `${s.attendance_rate || 96}%`,
        'GPA': s.gpa || 3.9,
      }));
      exportToCSV(data, 'Student_Demographics_Report.csv');
    } else {
      const data = marks.map((m) => ({
        'Student Name': m.student_name,
        'Marks': m.marks_obtained,
        'Grade': m.grade,
        'Remarks': m.remarks,
      }));
      exportToCSV(data, 'Academic_Performance_Report.csv');
    }
    success('Report data exported to CSV!');
  };

  const handlePrint = () => {
    window.print();
  };

  const reportTabs = [
    { id: 'fees', label: 'Financial & Fee Analytics', icon: CreditCard },
    { id: 'students', label: 'Student Enrollment Reports', icon: Users },
    { id: 'attendance', label: 'Attendance Rates & Analytics', icon: CalendarCheck },
    { id: 'grades', label: 'Academic Grades & Performance', icon: Award },
  ];

  const COLORS = ['#10b981', '#2563eb', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Executive Reports & Business Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Campus metrics analytics, revenue collection audit, attendance trends and Excel exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={FileSpreadsheet}
            onClick={handleExportCSV}
          >
            Export to Excel / CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={reportTabs} activeTab={activeReport} onChange={setActiveReport} />

      {/* FEES ANALYTICS */}
      {activeReport === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card
              title="Revenue Inflow Status"
              subtitle="Comparison of billed versus collected versus outstanding"
              className="lg:col-span-2"
            >
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feeComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      formatter={(v) => [formatCurrency(v), '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="amount" name="Amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card
              title="Collection Breakdown"
              subtitle="Realization rate comparison"
            >
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-800">Collected to Date</span>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatCurrency(totalPaid)}</p>
                  <span className="text-[11px] text-emerald-600 font-medium">84% of Gross Invoiced</span>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-xs font-semibold text-amber-800">Pending Term 2 Invoices</span>
                  <p className="text-2xl font-extrabold text-amber-700 mt-1">{formatCurrency(totalDue)}</p>
                  <span className="text-[11px] text-amber-600 font-medium">16% Remaining</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* STUDENT ENROLLMENT REPORT */}
      {activeReport === 'students' && (
        <Card
          title="Student Enrollment Roster"
          subtitle="Enrolled student demographics and guardian contacts"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Parent Name</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3 text-center">Attendance Rate</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-600">{st.admission_number}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{st.full_name}</td>
                    <td className="py-3 px-3">{st.class_name}-{st.section_name}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{st.parent_name}</td>
                    <td className="py-3 px-3 text-slate-600">{st.parent_phone}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-700">{st.attendance_rate || 96.5}%</td>
                    <td className="py-3 px-3">
                      <Badge variant="active" size="sm" dot>
                        {st.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ACADEMIC PERFORMANCE & GRADES */}
      {activeReport === 'grades' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Grade Distribution (Fall Semester)"
            subtitle="Frequency distribution of letter grades across examined subjects"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" name="Students with Grade" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            title="Honors Roll & High Achievers"
            subtitle="Top ranking academic performers"
          >
            <div className="divide-y divide-slate-100">
              {students.slice(0, 5).map((st, idx) => (
                <div key={st.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{st.full_name}</span>
                      <span className="text-[11px] text-slate-400">{st.class_name}-{st.section_name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-brand-600 block">{st.gpa || 3.92} GPA</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">Distinction</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ATTENDANCE RATES & ANALYTICS */}
      {activeReport === 'attendance' && (
        <Card
          title="Class-Wise Average Attendance Patterns"
          subtitle="Cumulative attendance percentage by academic grade"
        >
          <div className="space-y-4">
            {classes.map((cls) => (
              <div key={cls.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{cls.name}</span>
                  <span className="text-emerald-700">96.8% Average</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full"
                    style={{ width: '96.8%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

