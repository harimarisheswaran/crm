import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount, currency = 'USD') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

// Format Date
export function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Calculate Age
export function calculateAge(dobString) {
  if (!dobString) return '';
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

// Grade calculation helper
export function calculateGrade(marks, maxMarks = 100) {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return { grade: 'A+', gpa: 4.0, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (percentage >= 80) return { grade: 'A', gpa: 3.7, color: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (percentage >= 70) return { grade: 'B', gpa: 3.0, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
  if (percentage >= 60) return { grade: 'C', gpa: 2.5, color: 'text-amber-600 bg-amber-50 border-amber-200' };
  if (percentage >= 50) return { grade: 'D', gpa: 2.0, color: 'text-orange-600 bg-orange-50 border-orange-200' };
  return { grade: 'F', gpa: 0.0, color: 'text-red-600 bg-red-50 border-red-200' };
}

// Export data to CSV
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + (row[header] ?? '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

