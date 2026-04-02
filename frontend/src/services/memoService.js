import api from './api';

// Initial Mock Data to support development without backend
let memos = [
  {
    id: 'NIF/MEMO/2081/001',
    subject: 'Approval for Open Source IXP Software Development — APNIC Collaboration',
    from: 'Ram Bahadur Khatri, Programme Director',
    to: 'Dr. Hari Prasad Shrestha, Executive Director',
    date: '2025-01-10',
    dept: 'Programs',
    priority: 'Normal',
    bg: 'NIF has been in discussions with APNIC Foundation since Q3 2024 regarding a collaborative open-source project to develop IXP management software.',
    purpose: 'To seek Executive Director approval for entering into a formal MoU with APNIC Foundation.',
    body: 'APNIC contributes USD 80,000 and two senior engineers. All code released under Apache License 2.0.',
    action: 'Please approve the proposed collaboration.',
    checker: 'Sita Koirala — Programme Manager',
    approver: 'Dr. Hari Prasad Shrestha — Executive Director',
    notes: 'Critical for NIF 2025 open-source strategy.',
    status: 'approved',
    timeline: [
      { t: 'c', text: 'Memo drafted', by: 'Ram Bahadur Khatri (Maker)', date: '2025-01-08' },
      { t: 's', text: 'Submitted for review', by: 'Ram Bahadur Khatri (Maker)', date: '2025-01-10' },
      { t: 'ch', text: 'Reviewed and forwarded', by: 'Sita Koirala (Checker)', date: '2025-01-12' },
      { t: 'ok', text: 'Approved', by: 'Dr. Hari Prasad Shrestha (Approver)', date: '2025-01-14' }
    ]
  },
  {
    id: 'NIF/MEMO/2081/002',
    subject: 'Digital Transformation Roadmap FY 2081–82 — Budget Approval',
    from: 'Ram Bahadur Khatri, Programme Director',
    to: 'Dr. Hari Prasad Shrestha, Executive Director',
    date: '2025-01-22',
    dept: 'Programs',
    priority: 'Urgent',
    bg: 'NIF has initiated a comprehensive digital transformation exercise.',
    purpose: 'Budget approval of NPR 18,00,000 for technology infrastructure.',
    body: 'Four pillars: Document digitalisation, Open data portal, Staff training, Website redesign.',
    action: 'Review and approve roadmap.',
    checker: 'Sita Koirala — Programme Manager',
    approver: 'Dr. Hari Prasad Shrestha — Executive Director',
    notes: 'Finance committee pre-reviewed.',
    status: 'checking',
    timeline: [
      { t: 'c', text: 'Memo drafted', by: 'Ram Bahadur Khatri (Maker)', date: '2025-01-20' },
      { t: 's', text: 'Submitted', by: 'Ram Bahadur Khatri (Maker)', date: '2025-01-22' }
    ]
  }
];

export const memoService = {
  // Get all memos
  getAll: async () => {
    // In real app: return await api.get('/memos');
    return Promise.resolve({ data: memos });
  },

  // Get single memo
  getById: async (id) => {
    // In real app: return await api.get(`/memos/${encodeURIComponent(id)}`);
    const memo = memos.find(m => m.id === id);
    if (!memo) return Promise.reject(new Error('Memo not found'));
    return Promise.resolve({ data: memo });
  },

  // Create new memo
  create: async (data) => {
    // In real app: return await api.post('/memos', data);
    const newMemo = {
      ...data,
      id: `NIF/MEMO/2081/00${memos.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      status: data.isDraft ? 'draft' : 'submitted',
      timeline: [
        { t: 'c', text: 'Memo drafted', by: data.from, date: new Date().toISOString().split('T')[0] }
      ]
    };
    if (!data.isDraft) {
      newMemo.timeline.push({ t: 's', text: 'Submitted for review', by: data.from, date: new Date().toISOString().split('T')[0] });
    }
    memos.unshift(newMemo);
    return Promise.resolve({ data: newMemo });
  },

  // Update memo status
  updateStatus: async (id, action, note, user) => {
    // In real app: return await api.patch(`/memos/${encodeURIComponent(id)}/status`, { action, note });
    const memoIndex = memos.findIndex(m => m.id === id);
    if (memoIndex === -1) return Promise.reject(new Error('Memo not found'));
    
    const memo = { ...memos[memoIndex] };
    const date = new Date().toISOString().split('T')[0];
    
    if (action === 'submit') {
      memo.status = 'submitted';
      memo.timeline.push({ t: 's', text: 'Submitted for review', by: user, date, note });
    } else if (action === 'check') {
      memo.status = 'checking';
      memo.timeline.push({ t: 'ch', text: 'Reviewed and forwarded', by: user, date, note });
    } else if (action === 'approve') {
      memo.status = 'approved';
      memo.timeline.push({ t: 'ok', text: 'Approved', by: user, date, note });
    } else if (action === 'return') {
      memo.status = 'rejected';
      memo.timeline.push({ t: 'r', text: 'Returned for revision', by: user, date, note });
    }
    
    memos[memoIndex] = memo;
    return Promise.resolve({ data: memo });
  }
};
