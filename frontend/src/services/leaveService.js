import api from './api';

// Initial Mock Data to support development without backend
let leaves = [
  { id: 'LV-001', employee: 'Bikash Khatri', type: 'Annual Leave', start: '2081-01-15', end: '2081-01-17', days: 3, reason: 'Family function', status: 'approved', manager: 'Bikram Shrestha', applied: '2081-01-10', handover: 'Project Alpha handover to Sita' },
  { id: 'LV-002', employee: 'Bikash Kadayat', type: 'Sick Leave', start: '2081-02-01', end: '2081-02-02', days: 2, reason: 'Medical appointment', status: 'approved', manager: 'Bikram Shrestha', applied: '2081-01-28', handover: '' },
  { id: 'LV-003', employee: 'Subresh Thakulla', type: 'Casual Leave', start: '2081-02-20', end: '2081-02-20', days: 1, reason: 'Personal work', status: 'approved', manager: 'Bikram Shrestha', applied: '2081-02-15', handover: '' },
  { id: 'LV-004', employee: 'Bibek Shah', type: 'Annual Leave', start: '2081-03-10', end: '2081-03-12', days: 3, reason: 'Home visit', status: 'pending', manager: 'Bikram Shrestha', applied: '2081-03-05', handover: 'Quarterly report pending' },
  { id: 'LV-005', employee: 'Asmita Lamichhane', type: 'Annual Leave', start: '2081-03-12', end: '2081-03-13', days: 2, reason: 'Travel', status: 'approved', manager: 'Bikash Khatri', applied: '2081-03-01', handover: '' },
  { id: 'LV-006', employee: 'Ansuka Thapaliya', type: 'Sick Leave', start: '2081-03-25', end: '2081-03-26', days: 2, reason: 'Medical rest', status: 'pending', manager: 'Bikash Khatri', applied: '2081-03-20', handover: 'Salary processing delayed' },
];

export const leaveService = {
  // Get all leaves
  getAll: async () => {
    return Promise.resolve({ data: leaves });
  },

  // Create new leave application
  create: async (data, employeeName) => {
    const newLeave = {
      ...data,
      id: `LV-00${leaves.length + 1}`,
      employee: employeeName,
      status: 'pending',
      applied: new Date().toISOString().split('T')[0],
      days: calculateDays(data.start, data.end)
    };
    leaves.unshift(newLeave);
    return Promise.resolve({ data: newLeave });
  },

  // Update status (Approve/Reject)
  updateStatus: async (id, status) => {
    const idx = leaves.findIndex(l => l.id === id);
    if (idx === -1) return Promise.reject(new Error('Leave not found'));

    leaves[idx] = { ...leaves[idx], status };
    return Promise.resolve({ data: leaves[idx] });
  }
};

const calculateDays = (start, end) => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = Math.abs(d2 - d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};
