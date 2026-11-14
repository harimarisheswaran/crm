import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SCHOOL,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_CLASSES,
  INITIAL_SECTIONS,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_FEE_STRUCTURES,
  INITIAL_STUDENT_FEES,
  INITIAL_FEE_PAYMENTS,
  INITIAL_EXAMINATIONS,
  INITIAL_EXAM_SUBJECTS,
  INITIAL_MARKS,
  INITIAL_TIMETABLES,
  INITIAL_HOMEWORK,
  INITIAL_HOMEWORK_SUBMISSIONS,
  INITIAL_BOOKS,
  INITIAL_BOOK_ISSUES,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

const DataContext = createContext(null);

const STORAGE_KEY = 'edupulse_erp_database_v1';

export const DataProvider = ({ children }) => {
  // Load state from localStorage or initialize with seed data
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage data, loading initial state:', e);
    }
    return {
      school: INITIAL_SCHOOL,
      academicYears: INITIAL_ACADEMIC_YEARS,
      classes: INITIAL_CLASSES,
      sections: INITIAL_SECTIONS,
      subjects: INITIAL_SUBJECTS,
      teachers: INITIAL_TEACHERS,
      staff: INITIAL_STAFF,
      students: INITIAL_STUDENTS,
      attendance: INITIAL_ATTENDANCE,
      feeStructures: INITIAL_FEE_STRUCTURES,
      studentFees: INITIAL_STUDENT_FEES,
      feePayments: INITIAL_FEE_PAYMENTS,
      examinations: INITIAL_EXAMINATIONS,
      examSubjects: INITIAL_EXAM_SUBJECTS,
      marks: INITIAL_MARKS,
      timetables: INITIAL_TIMETABLES,
      homework: INITIAL_HOMEWORK,
      homeworkSubmissions: INITIAL_HOMEWORK_SUBMISSIONS,
      books: INITIAL_BOOKS,
      bookIssues: INITIAL_BOOK_ISSUES,
      vehicles: INITIAL_VEHICLES,
      routes: INITIAL_ROUTES,
      leaveRequests: INITIAL_LEAVE_REQUESTS,
      announcements: INITIAL_ANNOUNCEMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to sync to localStorage:', e);
    }
  }, [data]);

  // Log activity helper
  const logActivity = (action, module, details = null, user = 'Current User') => {
    const newLog = {
      id: `aud-${Date.now()}`,
      user,
      action,
      module,
      details,
      timestamp: new Date().toLocaleString(),
      ip: '127.0.0.1 (Local Session)',
    };
    setData(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs.slice(0, 49)],
    }));
  };

  // -------------------------------------------------------------
  // STUDENTS CRUD
  // -------------------------------------------------------------
  const addStudent = (studentData) => {
    const admissionNo = studentData.admission_number || `ADM-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent = {
      ...studentData,
      id: `std-${Date.now()}`,
      admission_number: admissionNo,
      full_name: `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim(),
      attendance_rate: 100,
      gpa: 4.0,
      status: studentData.status || 'active',
      admission_date: studentData.admission_date || new Date().toISOString().split('T')[0],
      photo_url: studentData.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    setData(prev => ({
      ...prev,
      students: [newStudent, ...prev.students],
    }));

    logActivity(`Admitted New Student: ${newStudent.full_name}`, 'Student Management');
    return newStudent;
  };

  const updateStudent = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      students: prev.students.map(s => {
        if (s.id === id) {
          const updated = { ...s, ...updatedFields };
          if (updatedFields.first_name || updatedFields.last_name) {
            updated.full_name = `${updated.first_name || ''} ${updated.last_name || ''}`.trim();
          }
          return updated;
        }
        return s;
      }),
    }));
    logActivity(`Updated Student profile #${id}`, 'Student Management');
  };

  const deleteStudent = (id) => {
    setData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id),
    }));
    logActivity(`Deleted/Archived Student #${id}`, 'Student Management');
  };

  // -------------------------------------------------------------
  // TEACHERS CRUD
  // -------------------------------------------------------------
  const addTeacher = (teacherData) => {
    const newTeacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
      employee_id: teacherData.employee_id || `EMP-TCH-${Math.floor(1000 + Math.random() * 9000)}`,
      joining_date: teacherData.joining_date || new Date().toISOString().split('T')[0],
      status: 'active',
      avatar_url: teacherData.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    };
    setData(prev => ({
      ...prev,
      teachers: [newTeacher, ...prev.teachers],
    }));
    logActivity(`Added Teacher: ${newTeacher.name}`, 'Teacher Management');
    return newTeacher;
  };

  const updateTeacher = (id, fields) => {
    setData(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => (t.id === id ? { ...t, ...fields } : t)),
    }));
    logActivity(`Updated Teacher #${id}`, 'Teacher Management');
  };

  const deleteTeacher = (id) => {
    setData(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id),
    }));
    logActivity(`Removed Teacher record #${id}`, 'Teacher Management');
  };

  // -------------------------------------------------------------
  // CLASSES & SECTIONS
  // -------------------------------------------------------------
  const addClass = (classData) => {
    const newClass = {
      ...classData,
      id: `cls-${Date.now()}`,
      sections_count: 0,
    };
    setData(prev => ({
      ...prev,
      classes: [...prev.classes, newClass],
    }));
    logActivity(`Created Class: ${newClass.name}`, 'Class Management');
    return newClass;
  };

  const addSection = (sectionData) => {
    const newSection = {
      ...sectionData,
      id: `sec-${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      classes: prev.classes.map(c =>
        c.id === sectionData.class_id
          ? { ...c, sections_count: (c.sections_count || 0) + 1 }
          : c
      ),
    }));
    logActivity(`Created Section ${newSection.name}`, 'Class Management');
    return newSection;
  };

  // -------------------------------------------------------------
  // ATTENDANCE MANAGEMENT
  // -------------------------------------------------------------
  const markDailyAttendance = (records) => {
    // records: Array of { student_id, student_name, class_id, section_id, attendance_date, status, remarks }
    setData(prev => {
      // Filter out existing records for this student and date
      const keys = new Set(records.map(r => `${r.student_id}_${r.attendance_date}`));
      const existing = prev.attendance.filter(a => !keys.has(`${a.student_id}_${a.attendance_date}`));
      const newItems = records.map(r => ({
        ...r,
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      }));
      return {
        ...prev,
        attendance: [...newItems, ...existing],
      };
    });
    logActivity(`Marked daily student attendance (${records.length} records)`, 'Attendance');
  };

  // -------------------------------------------------------------
  // FEES MANAGEMENT
  // -------------------------------------------------------------
  const addFeeStructure = (feeData) => {
    const newStructure = {
      ...feeData,
      id: `fs-${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      feeStructures: [...prev.feeStructures, newStructure],
    }));
    logActivity(`Added Fee Structure: ${newStructure.title}`, 'Fees');
    return newStructure;
  };

  const createStudentInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoice_number: invoiceData.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      paid_amount: 0,
      due_amount: invoiceData.total_amount - (invoiceData.discount_amount || 0),
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0],
    };
    setData(prev => ({
      ...prev,
      studentFees: [newInvoice, ...prev.studentFees],
    }));
    logActivity(`Issued Invoice #${newInvoice.invoice_number} for ${newInvoice.student_name}`, 'Fees');
    return newInvoice;
  };

  const recordFeePayment = (paymentData) => {
    // paymentData: { student_fee_id, student_id, student_name, amount_paid, payment_method, transaction_id, notes }
    const amount = Number(paymentData.amount_paid);
    const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPayment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receipt_number: receiptNo,
      amount_paid: amount,
      payment_date: new Date().toLocaleString(),
      collected_by: paymentData.collected_by || 'Bursar Office',
    };

    setData(prev => {
      // Update the student fee invoice
      const updatedInvoices = prev.studentFees.map(inv => {
        if (inv.id === paymentData.student_fee_id) {
          const newPaid = Number(inv.paid_amount || 0) + amount;
          const newDue = Math.max(0, Number(inv.total_amount) - Number(inv.discount_amount || 0) - newPaid);
          const newStatus = newDue <= 0 ? 'paid' : newPaid > 0 ? 'partially_paid' : inv.status;
          return {
            ...inv,
            paid_amount: newPaid,
            due_amount: newDue,
            status: newStatus,
          };
        }
        return inv;
      });

      return {
        ...prev,
        studentFees: updatedInvoices,
        feePayments: [newPayment, ...prev.feePayments],
      };
    });

    logActivity(`Recorded Payment #${receiptNo} of $${amount}`, 'Fees');
    return newPayment;
  };

  // -------------------------------------------------------------
  // EXAMINATIONS & MARKS
  // -------------------------------------------------------------
  const addExamination = (examData) => {
    const newExam = {
      ...examData,
      id: `exm-${Date.now()}`,
      status: examData.status || 'upcoming',
    };
    setData(prev => ({
      ...prev,
      examinations: [newExam, ...prev.examinations],
    }));
    logActivity(`Created Examination: ${newExam.name}`, 'Examinations');
    return newExam;
  };

  const saveSubjectMarks = (marksList) => {
    // marksList: Array of { exam_subject_id, student_id, student_name, marks_obtained, grade, remarks }
    setData(prev => {
      const keys = new Set(marksList.map(m => `${m.exam_subject_id}_${m.student_id}`));
      const existing = prev.marks.filter(m => !keys.has(`${m.exam_subject_id}_${m.student_id}`));
      const newItems = marksList.map(m => ({
        ...m,
        id: `mrk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      }));
      return {
        ...prev,
        marks: [...newItems, ...existing],
      };
    });
    logActivity(`Recorded marks for ${marksList.length} students`, 'Examinations');
  };

  // -------------------------------------------------------------
  // TIMETABLES
  // -------------------------------------------------------------
  const addTimetableSlot = (slotData) => {
    const newSlot = {
      ...slotData,
      id: `tt-${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      timetables: [...prev.timetables, newSlot],
    }));
    logActivity(`Added Timetable Period for ${slotData.day_of_week}`, 'Timetables');
    return newSlot;
  };

  const deleteTimetableSlot = (id) => {
    setData(prev => ({
      ...prev,
      timetables: prev.timetables.filter(t => t.id !== id),
    }));
  };

  // -------------------------------------------------------------
  // HOMEWORK & ASSIGNMENTS
  // -------------------------------------------------------------
  const addHomework = (hwData) => {
    const newHw = {
      ...hwData,
      id: `hw-${Date.now()}`,
      submissions_count: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    setData(prev => ({
      ...prev,
      homework: [newHw, ...prev.homework],
    }));
    logActivity(`Created Homework Assignment: ${newHw.title}`, 'Homework');
    return newHw;
  };

  const submitHomework = (submissionData) => {
    const newSub = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submitted_at: new Date().toLocaleString(),
      status: 'submitted',
      score: null,
      feedback: '',
    };
    setData(prev => {
      // update homework submissions_count
      const updatedHw = prev.homework.map(h =>
        h.id === submissionData.homework_id
          ? { ...h, submissions_count: (h.submissions_count || 0) + 1 }
          : h
      );
      // filter out existing
      const filteredSubs = prev.homeworkSubmissions.filter(
        s => !(s.homework_id === submissionData.homework_id && s.student_id === submissionData.student_id)
      );
      return {
        ...prev,
        homework: updatedHw,
        homeworkSubmissions: [newSub, ...filteredSubs],
      };
    });
    logActivity(`Submitted Homework #${submissionData.homework_id}`, 'Homework');
    return newSub;
  };

  const gradeSubmission = (submissionId, score, feedback, gradedBy) => {
    setData(prev => ({
      ...prev,
      homeworkSubmissions: prev.homeworkSubmissions.map(s =>
        s.id === submissionId
          ? { ...s, score, feedback, graded_by: gradedBy, status: 'graded' }
          : s
      ),
    }));
    logActivity(`Graded assignment submission #${submissionId}`, 'Homework');
  };

  // -------------------------------------------------------------
  // LIBRARY
  // -------------------------------------------------------------
  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: `bk-${Date.now()}`,
      available_copies: bookData.total_copies || 1,
    };
    setData(prev => ({
      ...prev,
      books: [newBook, ...prev.books],
    }));
    logActivity(`Added Book: ${newBook.title}`, 'Library');
    return newBook;
  };

  const issueBook = (issueData) => {
    // issueData: { book_id, book_title, student_id, student_name, due_date }
    const newIssue = {
      ...issueData,
      id: `bi-${Date.now()}`,
      issue_date: new Date().toISOString().split('T')[0],
      status: 'issued',
      fine_amount: 0,
    };
    setData(prev => ({
      ...prev,
      bookIssues: [newIssue, ...prev.bookIssues],
      books: prev.books.map(b =>
        b.id === issueData.book_id
          ? { ...b, available_copies: Math.max(0, (b.available_copies || 1) - 1) }
          : b
      ),
    }));
    logActivity(`Issued Book ${issueData.book_title} to ${issueData.student_name}`, 'Library');
    return newIssue;
  };

  const returnBook = (issueId) => {
    setData(prev => {
      const issue = prev.bookIssues.find(i => i.id === issueId);
      if (!issue) return prev;
      return {
        ...prev,
        bookIssues: prev.bookIssues.map(i =>
          i.id === issueId
            ? { ...i, status: 'returned', return_date: new Date().toISOString().split('T')[0] }
            : i
        ),
        books: prev.books.map(b =>
          b.id === issue.book_id
            ? { ...b, available_copies: (b.available_copies || 0) + 1 }
            : b
        ),
      };
    });
    logActivity(`Returned Library Book issue #${issueId}`, 'Library');
  };

  // -------------------------------------------------------------
  // TRANSPORT
  // -------------------------------------------------------------
  const addVehicle = (vehData) => {
    const newVeh = {
      ...vehData,
      id: `veh-${Date.now()}`,
      status: 'active',
    };
    setData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVeh],
    }));
    logActivity(`Added Transport Vehicle: ${newVeh.vehicle_number}`, 'Transport');
    return newVeh;
  };

  const addRoute = (routeData) => {
    const newRoute = {
      ...routeData,
      id: `rt-${Date.now()}`,
      students_count: 0,
    };
    setData(prev => ({
      ...prev,
      routes: [...prev.routes, newRoute],
    }));
    logActivity(`Added Transport Route: ${newRoute.route_name}`, 'Transport');
    return newRoute;
  };

  // -------------------------------------------------------------
  // LEAVE REQUESTS
  // -------------------------------------------------------------
  const applyLeave = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `lv-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0],
      response_remarks: '',
    };
    setData(prev => ({
      ...prev,
      leaveRequests: [newLeave, ...prev.leaveRequests],
    }));
    logActivity(`Submitted leave application (${leaveData.leave_type})`, 'Staff HR');
    return newLeave;
  };

  const updateLeaveStatus = (leaveId, status, response_remarks, approved_by) => {
    setData(prev => ({
      ...prev,
      leaveRequests: prev.leaveRequests.map(l =>
        l.id === leaveId
          ? { ...l, status, response_remarks, approved_by }
          : l
      ),
    }));
    logActivity(`Updated Leave Request #${leaveId} to ${status}`, 'Staff HR');
  };

  // -------------------------------------------------------------
  // ANNOUNCEMENTS
  // -------------------------------------------------------------
  const postAnnouncement = (announcementData) => {
    const newAnc = {
      ...announcementData,
      id: `anc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setData(prev => ({
      ...prev,
      announcements: [newAnc, ...prev.announcements],
    }));
    logActivity(`Posted Announcement: ${newAnc.title}`, 'Communication');
    return newAnc;
  };

  // -------------------------------------------------------------
  // SETTINGS & DATABASE MANAGEMENT
  // -------------------------------------------------------------
  const updateSchoolSettings = (newSettings) => {
    setData(prev => ({
      ...prev,
      school: { ...prev.school, ...newSettings },
    }));
    logActivity('Updated School Profile & Settings', 'Settings');
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData({
      school: INITIAL_SCHOOL,
      academicYears: INITIAL_ACADEMIC_YEARS,
      classes: INITIAL_CLASSES,
      sections: INITIAL_SECTIONS,
      subjects: INITIAL_SUBJECTS,
      teachers: INITIAL_TEACHERS,
      staff: INITIAL_STAFF,
      students: INITIAL_STUDENTS,
      attendance: INITIAL_ATTENDANCE,
      feeStructures: INITIAL_FEE_STRUCTURES,
      studentFees: INITIAL_STUDENT_FEES,
      feePayments: INITIAL_FEE_PAYMENTS,
      examinations: INITIAL_EXAMINATIONS,
      examSubjects: INITIAL_EXAM_SUBJECTS,
      marks: INITIAL_MARKS,
      timetables: INITIAL_TIMETABLES,
      homework: INITIAL_HOMEWORK,
      homeworkSubmissions: INITIAL_HOMEWORK_SUBMISSIONS,
      books: INITIAL_BOOKS,
      bookIssues: INITIAL_BOOK_ISSUES,
      vehicles: INITIAL_VEHICLES,
      routes: INITIAL_ROUTES,
      leaveRequests: INITIAL_LEAVE_REQUESTS,
      announcements: INITIAL_ANNOUNCEMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    });
    logActivity('Reset ERP Database to Initial Seed State', 'System');
  };

  return (
    <DataContext.Provider
      value={{
        ...data,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        addSection,
        markDailyAttendance,
        addFeeStructure,
        createStudentInvoice,
        recordFeePayment,
        addExamination,
        saveSubjectMarks,
        addTimetableSlot,
        deleteTimetableSlot,
        addHomework,
        submitHomework,
        gradeSubmission,
        addBook,
        issueBook,
        returnBook,
        addVehicle,
        addRoute,
        applyLeave,
        updateLeaveStatus,
        postAnnouncement,
        updateSchoolSettings,
        resetToDefaults,
        logActivity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

