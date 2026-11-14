-- ==============================================================================
-- EDUPULSE ERP - COMPREHENSIVE POSTGRESQL SCHEMA FOR SUPABASE
-- Production-grade schema with RLS, triggers, indexes, and relations
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    logo_url TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    currency VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(5) DEFAULT '$',
    academic_year_start_month INT DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ACADEMIC YEARS
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "2024-2025"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER PROFILES (Connects to Supabase auth.users or standalone auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE, -- Foreign key to auth.users if Supabase Auth is enabled
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_admin',
        'school_admin',
        'principal',
        'teacher',
        'accountant',
        'receptionist',
        'student',
        'parent'
    )),
    phone VARCHAR(50),
    avatar_url TEXT,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Grade 10" or "Class 10"
    numeric_grade INT,
    capacity INT DEFAULT 40,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SECTIONS
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g. "A", "B", "C"
    room_number VARCHAR(50),
    class_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(50) DEFAULT 'Core' CHECK (type IN ('Core', 'Elective', 'Practical', 'Language', 'Extracurricular')),
    credits NUMERIC(3, 1) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CLASS SUBJECT ASSIGNMENT (with Teacher)
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    periods_per_week INT DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PARENTS
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    father_name VARCHAR(150),
    father_occupation VARCHAR(100),
    father_phone VARCHAR(50),
    father_email VARCHAR(150),
    mother_name VARCHAR(150),
    mother_occupation VARCHAR(100),
    mother_phone VARCHAR(50),
    mother_email VARCHAR(150),
    guardian_name VARCHAR(150),
    guardian_relation VARCHAR(50),
    guardian_phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
    admission_number VARCHAR(100) UNIQUE NOT NULL,
    roll_number VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group VARCHAR(10),
    religion VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'American',
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relation VARCHAR(50),
    medical_allergies TEXT,
    medical_conditions TEXT,
    previous_school_name VARCHAR(255),
    previous_school_grade VARCHAR(50),
    previous_school_tc_number VARCHAR(100),
    admission_date DATE DEFAULT CURRENT_DATE,
    current_class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    current_section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    current_academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'alumni', 'transferred', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TEACHERS & STAFF
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    qualification VARCHAR(255),
    experience_years INT DEFAULT 0,
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE,
    salary NUMERIC(10, 2),
    contract_type VARCHAR(50) DEFAULT 'Permanent' CHECK (contract_type IN ('Permanent', 'Contract', 'Part-time', 'Visiting')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. STAFF (Non-teaching: Accountant, Receptionist, Security, IT, etc.)
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    joining_date DATE,
    salary NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ATTENDANCE (Student & Staff)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('student', 'teacher', 'staff')),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'excused')),
    remarks TEXT,
    marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (entity_type, student_id, attendance_date),
    UNIQUE (entity_type, staff_id, attendance_date)
);

-- 13. FEE STRUCTURES & CATEGORIES
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL, -- e.g. "Annual Tuition Fee Grade 10"
    fee_type VARCHAR(50) NOT NULL CHECK (fee_type IN ('Tuition', 'Admission', 'Transport', 'Examination', 'Library', 'Sports', 'Laboratory', 'Miscellaneous')),
    amount NUMERIC(10, 2) NOT NULL,
    frequency VARCHAR(50) DEFAULT 'Termly' CHECK (frequency IN ('One-Time', 'Monthly', 'Termly', 'Annually')),
    due_date DATE,
    late_fine_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. STUDENT FEES (Invoices)
CREATE TABLE IF NOT EXISTS public.student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    fee_structure_id UUID REFERENCES public.fee_structures(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    paid_amount NUMERIC(10, 2) DEFAULT 0,
    due_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'partially_paid', 'pending', 'overdue')),
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. FEE PAYMENTS (Receipts)
CREATE TABLE IF NOT EXISTS public.fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_fee_id UUID REFERENCES public.student_fees(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Cash', 'Card', 'Bank Transfer', 'Online Gateway', 'Cheque')),
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    collected_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. EXAMINATIONS
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL, -- e.g. "Midterm Examinations 2024"
    term VARCHAR(50) DEFAULT 'Term 1',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. EXAM SCHEDULES / SUBJECTS
CREATE TABLE IF NOT EXISTS public.exam_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examination_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_marks NUMERIC(5, 2) DEFAULT 100,
    pass_marks NUMERIC(5, 2) DEFAULT 40,
    room_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. MARKS
CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_subject_id UUID REFERENCES public.exam_subjects(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5, 2) NOT NULL,
    grade VARCHAR(5),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (exam_subject_id, student_id)
);

-- 19. TIMETABLES
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    day_of_week VARCHAR(15) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    period_number INT NOT NULL,
    room_number VARCHAR(50),
    is_break BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. HOMEWORK & ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    attachment_url TEXT,
    max_score INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. HOMEWORK SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_id UUID REFERENCES public.homework(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    submission_text TEXT,
    attachment_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score NUMERIC(5, 2),
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'resubmit_required', 'late')),
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (homework_id, student_id)
);

-- 22. LIBRARY BOOKS
CREATE TABLE IF NOT EXISTS public.library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) UNIQUE,
    category VARCHAR(100),
    publisher VARCHAR(150),
    published_year INT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    shelf_location VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. BOOK ISSUES & RETURNS
CREATE TABLE IF NOT EXISTS public.book_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount NUMERIC(8, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue', 'lost')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 24. TRANSPORT VEHICLES
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_model VARCHAR(100),
    capacity INT NOT NULL,
    driver_name VARCHAR(150) NOT NULL,
    driver_license VARCHAR(100),
    driver_phone VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 25. TRANSPORT ROUTES & STOPS
CREATE TABLE IF NOT EXISTS public.transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    route_name VARCHAR(150) NOT NULL,
    start_point VARCHAR(150) NOT NULL,
    end_point VARCHAR(150) NOT NULL,
    pickup_time TIME,
    drop_time TIME,
    fee_per_term NUMERIC(10, 2) DEFAULT 0,
    stops_json JSONB DEFAULT '[]'::jsonb, -- e.g. [{"stop": "Maple Ave", "time": "07:15"}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. LEAVE REQUESTS (Staff & Teachers)
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('Sick Leave', 'Casual Leave', 'Maternity/Paternity', 'Emergency', 'Annual')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    response_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 27. ANNOUNCEMENTS & NOTICE BOARD
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience VARCHAR(50) DEFAULT 'all' CHECK (audience IN ('all', 'teachers', 'parents', 'students', 'staff')),
    importance VARCHAR(20) DEFAULT 'normal' CHECK (importance IN ('low', 'normal', 'high', 'urgent')),
    published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    expires_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 28. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'danger', 'fee', 'exam', 'attendance')),
    is_read BOOLEAN DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 29. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_school ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_school ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(current_class_id);
CREATE INDEX IF NOT EXISTS idx_students_admission ON public.students(admission_number);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_student ON public.student_fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_status ON public.student_fees(status);
CREATE INDEX IF NOT EXISTS idx_marks_exam_subject ON public.marks(exam_subject_id);
CREATE INDEX IF NOT EXISTS idx_marks_student ON public.marks(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_class ON public.homework(class_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated users
CREATE POLICY "Allow authenticated read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Allow school members read school" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Allow staff & teachers manage students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow staff manage fees" ON public.student_fees FOR ALL USING (true);
CREATE POLICY "Allow read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow read notifications" ON public.notifications FOR ALL USING (true);

