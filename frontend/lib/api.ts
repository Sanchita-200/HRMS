// API Service Layer Scaffolding
// Prepares frontend to connect with FastAPI routes in future stages

export interface MockEmployee {
  id: string;
  employee_number: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joining_date: string;
  status: string;
  burnout_risk: number;
}

export interface MockLeave {
  id: string;
  employee_name: string;
  leave_type: string;
  reason: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  ai_recommendation: string;
}

export const mockEmployees: MockEmployee[] = [
  { id: '1', employee_number: 'EMP/2026/001', full_name: 'Sarah Jenkins', email: 's.jenkins@hrms.com', phone: '+91 98765 43210', department: 'Engineering', designation: 'Staff Frontend Engineer', joining_date: '2022-04-12', status: 'active', burnout_risk: 78 },
  { id: '2', employee_number: 'EMP/2026/002', full_name: 'David Kross', email: 'd.kross@hrms.com', phone: '+91 98123 45678', department: 'Engineering', designation: 'Senior Python Developer', joining_date: '2023-01-15', status: 'active', burnout_risk: 42 },
  { id: '3', employee_number: 'EMP/2026/003', full_name: 'Elena Rostova', email: 'e.rostova@hrms.com', phone: '+91 97654 32109', department: 'Human Resources', designation: 'HR Lead Specialist', joining_date: '2021-08-01', status: 'active', burnout_risk: 15 },
  { id: '4', employee_number: 'EMP/2026/004', full_name: 'Marcus Vance', email: 'm.vance@hrms.com', phone: '+91 96543 21098', department: 'Finance', designation: 'Payroll Manager', joining_date: '2020-11-01', status: 'active', burnout_risk: 88 },
  { id: '5', employee_number: 'EMP/2026/005', full_name: 'Aisha Rahman', email: 'a.rahman@hrms.com', phone: '+91 95432 10987', department: 'Marketing', designation: 'SEO Lead Organizer', joining_date: '2023-06-01', status: 'active', burnout_risk: 30 }
];

export const mockLeaveRequests: MockLeave[] = [
  { id: 'l1', employee_name: 'Sarah Jenkins', leave_type: 'Paid Leave', reason: 'Personal errands and family trip', start_date: '2026-07-06', end_date: '2026-07-08', status: 'pending', ai_recommendation: 'Auto-Approval: Low risk of department understaffing. Average team presence remains at 88%.' },
  { id: 'l2', employee_name: 'David Kross', leave_type: 'Sick Leave', reason: 'Dental surgery and rest', start_date: '2026-07-10', end_date: '2026-07-11', status: 'pending', ai_recommendation: 'Auto-Approval: Valid medical leave. Coverage provided by Elena Rostova.' },
  { id: 'l3', employee_name: 'Marcus Vance', leave_type: 'Casual Leave', reason: 'Moving to new apartment', start_date: '2026-07-15', end_date: '2026-07-15', status: 'approved', ai_recommendation: 'Approved. No payroll overlaps.' }
];

export const mockAttendanceRecords = [
  { date: '2026-07-01', check_in: '09:02 AM', check_out: '06:05 PM', hours: 9.0, status: 'present' },
  { date: '2026-07-02', check_in: '08:55 AM', check_out: '05:45 PM', hours: 8.8, status: 'present' },
  { date: '2026-07-03', check_in: '09:15 AM', check_out: '06:10 PM', hours: 8.9, status: 'late' },
  { date: '2026-07-04', check_in: '09:00 AM', check_out: '06:00 PM', hours: 9.0, status: 'present' }
];
