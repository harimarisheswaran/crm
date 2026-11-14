# EduPulse ERP — Enterprise School Management CRM & ERP

**EduPulse ERP** is a unified, commercial-grade School Management CRM and ERP web application built for modern educational institutions, multi-campus academies, and K-12 school districts. It consolidates all academic, administrative, financial, logistical, and communication operations into one real-time, responsive platform.

---

## 🚀 Live Tech Stack

- **Frontend Framework**: React 18+ with Vite
- **Language**: JavaScript (ES Modules, JSX)
- **Styling**: Tailwind CSS v3 with custom Navy & Royal Blue Design System
- **Icons**: Lucide React
- **Analytics & Visualizations**: Recharts (Dynamic BarCharts, AreaCharts, PieCharts)
- **Animation & Confetti**: Canvas-Confetti for fee settlements and achievements
- **Backend & Database**: Supabase PostgreSQL, Authentication, Storage & Row Level Security (RLS)
- **State Management**: Reactive DataContext with automatic LocalStorage persistence and Supabase synchronization

---

## 🔐 8 Authenticated User Roles & Portals

EduPulse ERP features strict role-based access control (RBAC) across 8 distinct user personas:

| Role | Default Access | Dedicated Portal |
| :--- | :--- | :--- |
| **Super Admin** | Full multi-school & system-level control | Executive Admin Dashboard & Audit Logs |
| **School Admin** | Campus operations, academic years, faculty & finances | Administrative ERP Dashboard |
| **Principal** | Academic performance, staff evaluations, leave approvals | Executive Academic Workspace |
| **Teacher** | Class allocations, attendance, homework, exams & grading | Faculty Workspace & Timetables |
| **Accountant** | Invoicing, fee structures, receipts & financial audit | Bursar & Financial Accounting Portal |
| **Receptionist** | Visitor logs, student directory, phone inquiries | Campus Front Desk Portal |
| **Student** | Personal ID card, attendance, timetable, turn-in homework | Student Learning & Academic Portal |
| **Parent** | Multi-child switcher, fee payments, report cards | Parent Portal & Teacher Consultations |

> 💡 **Quick Role Switcher**: Click the **"Viewing as: [Role]"** pill in the top header or on the login page to instantly switch roles with 1 click to test every role's dedicated experience.

---

## 🏛️ Comprehensive Modules & Capabilities

### 1. Executive Admin Dashboard
- **8 Primary Stat Cards**: Total Students, Teachers, Classes, Staff, Today's Attendance %, Monthly Collection, Pending Fees, Upcoming Exams.
- **Interactive Recharts**: Monthly Fee Collections vs Billing Targets (Bar Chart), Weekly Attendance Trends (Area Chart), Classroom Capacity vs Enrollment (Bar Chart).
- **Recent Admissions Table**: Quick profile preview and admission number tracking.
- **Campus Activity Feed**: Audit trail of administrative operations with timestamps.

### 2. Student Management Module
- Complete Student Demographics: ID generation, Roll #, DOB, Gender, Blood group, Parent info, Emergency contacts, Allergies, Prior school records.
- Class and section allocation with academic year tracking.
- Interactive **Student Profile Modal** with 5 tabs: *Overview, Attendance Log, Fee Invoices, Academic Exam Results, Medical Background*.
- Export student rosters to CSV / Excel and printable report formats.

### 3. Faculty & Teacher Management
- Teacher profile catalog with Department categorization (*Mathematics, Science, Technology, Humanities, etc.*).
- Academic qualifications, years of experience, contract types, salary records, and assigned courses.
- Add Faculty Member modal with instant roster update.

### 4. Classes, Sections & Subjects Management
- Academic year configuration (*Current, Completed, Upcoming*).
- Class creation with capacity tracking and student strength counters.
- Section management with designated homeroom teachers and room numbers.
- Curriculum Subject Catalog with Course Codes (*MATH-101, PHY-102, CS-105*), credit units, and lecture frequencies.

### 5. Daily Attendance Management
- Real-time attendance marking sheet with Class, Section, and Date filters.
- Batch action buttons: **"Mark All Present"** & **"Mark All Absent"**.
- Per-student status toggles: **Present**, **Absent**, **Late**, **Half-day**, **Excused** with optional remarks.
- Live percentage calculations and monthly attendance summary reports.

### 6. Fees & Financial Accounting
- Multi-tier Fee Structures (*Tuition, Admission, Transport, Lab, Library, Exam dues*).
- Student fee invoicing with discount/scholarship allowances.
- **Collect Fee / Record Payment Modal**: Supports Cash, Card, Bank Wire/ACH, Online Gateway, and Cheque.
- Confetti celebration animation upon recording payment!
- **Official Printable Fee Receipt**: Generates printable institutional receipt with school letterhead, receipt number, breakdown, and bursar seal.

### 7. Examinations & Report Card Generator
- Examination schedule management (*Midterms, Unit Tests, Final Exams*).
- Subject schedules with exam dates, time windows, max marks, and pass marks.
- **Marks Entry Sheet**: Allows teachers/admins to enter obtained scores with automated letter grades (*A+, A, B, C, F*) and GPA calculation.
- **Official Student Report Card**: One-click printable term transcript with school crest, class rank (*e.g., Rank 2nd / 120*), teacher comments, and principal signature block.

### 8. Timetable Management
- Weekly schedule grid (*Monday through Friday, Periods 1 to 7*).
- Period management, classroom venue allocations, faculty assignment, and break/recess indicators.
- One-click clean print view for classroom walls and student planners.

### 9. Homework & Digital Assignments
- Teachers create assignments with due dates, point maximums, instructions, and file attachment tags.
- Student **"Turn In Assignment"** modal to submit answers, code links, or documents.
- Review and grading interface with score assignment and teacher feedback.

### 10. Library Management
- Book catalog with ISBN, authors, publishers, and shelf locations.
- Real-time inventory tracking (*Available Copies vs Total Copies*).
- Book issue and check-in return workflow with overdue fine calculation.

### 11. Transport Management
- Fleet vehicle records (*Blue Bird buses, Mercedes Sprinters*) with license plates and passenger capacities.
- Licensed driver profiles and emergency contact numbers.
- Route management with designated pickup/drop times, corridor stops, and term transit fees.

### 12. Staff & Human Resources Management
- Non-teaching staff directory (*Bursar, Receptionist, IT Administrator, Campus Nurse*).
- Employee leave application and **Admin Approval / Rejection Workflow** with remarks.
- Annual and monthly compensation payroll tracking.

### 13. Communications, Notice Board & SMS Gateway
- Target audience publishing: *All Public, Parents Only, Students Only, Teachers Only*.
- Priority classification: *Urgent, High, Normal*.
- Integrated SMS Gateway simulator for emergency broadcasts.

### 14. Executive Reports & Analytics
- Data visualization suite powered by Recharts.
- Fee realization reports, student strength distribution, grade frequencies, and attendance compliance.
- Export all reports to CSV/Excel with one click.

### 15. Institutional Settings
- General School Profile: Name, Code, Logo, Motto, Campus Address, Contact, Billing Currency.
- Database Connection check: Shows Supabase PostgreSQL status.
- Factory reset button to reset the database to clean seed defaults.

---

## 🗄️ Supabase PostgreSQL Database Schema

The full PostgreSQL relational schema is available in [`supabase-schema.sql`](file:///e:/reply/supabase-schema.sql).

Tables included:
1. `schools`
2. `academic_years`
3. `profiles`
4. `classes`
5. `sections`
6. `subjects`
7. `class_subjects`
8. `parents`
9. `students`
10. `teachers`
11. `staff`
12. `attendance`
13. `fee_structures`
14. `student_fees`
15. `fee_payments`
16. `examinations`
17. `exam_subjects`
18. `marks`
19. `timetables`
20. `homework`
21. `homework_submissions`
22. `library_books`
23. `book_issues`
24. `vehicles`
25. `transport_routes`
26. `leave_requests`
27. `announcements`
28. `notifications`
29. `audit_logs`

Includes indexes, foreign key cascades, and Supabase Row Level Security (RLS) policies.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔑 Demo Login Credentials

You can use any of the credentials below or click any of the 8 quick login buttons on the login screen or in the top navigation bar:

| Role | Email | Password |
| :--- | :--- | :--- |
| **School Admin** | `admin@oakridge.edu` | `password123` |
| **Super Admin** | `superadmin@oakridge.edu` | `password123` |
| **Principal** | `principal@oakridge.edu` | `password123` |
| **Teacher** | `teacher@oakridge.edu` | `password123` |
| **Accountant** | `accountant@oakridge.edu` | `password123` |
| **Receptionist** | `receptionist@oakridge.edu` | `password123` |
| **Student** | `student@oakridge.edu` | `password123` |
| **Parent** | `parent@oakridge.edu` | `password123` |

