import api from './api';

const statusActionCode = {
  draft: 'c',
  submitted: 's',
  checked: 'ch',
  approved: 'ok',
  rejected: 'r',
  returned: 'r',
};

const actionLabel = {
  draft: 'Drafted',
  submitted: 'Submitted',
  checked: 'Reviewed and forwarded',
  approved: 'Approved',
  rejected: 'Rejected',
  returned: 'Returned',
};

const normalizeTimelineItem = (log) => ({
  t: statusActionCode[log.action] || 's',
  text: actionLabel[log.action] || log.action,
  by: log.performed_by_name || 'System',
  date: log.timestamp ? log.timestamp.split('T')[0] : '',
  note: log.remarks,
});

const normalizeMemo = (memo) => ({
  id: memo.ref_no || memo.id,
  ref_no: memo.ref_no || memo.id,
  subject: memo.subject || '',
  bg: memo.background || '',
  purpose: memo.purpose || '',
  body: memo.details || '',
  action: memo.action_expected || '',
  status: memo.status || 'draft',
  dept: memo.department || 'General',
  priority: memo.priority ? memo.priority.charAt(0).toUpperCase() + memo.priority.slice(1) : 'Normal',
  date: memo.created_at ? memo.created_at.split('T')[0] : '',
  from: memo.maker_name ? `${memo.maker_name}, Maker` : 'Maker',
  checker: memo.checker_name ? `${memo.checker_name} — Checker` : 'Checker',
  approver: memo.approver_name ? `${memo.approver_name} — Approver` : 'Approver',
  to: memo.approver_name ? `To: ${memo.approver_name}` : 'To: Executive Director',
  timeline: Array.isArray(memo.workflow_logs) ? memo.workflow_logs.map(normalizeTimelineItem) : [],
});

const toBackendMemo = (data) => ({
  subject: data.subject,
  background: data.author ? `Author: ${data.author}` : 'Draft memo created by app.',
  purpose: data.assignee ? `Assigned to: ${data.assignee}` : 'No assignee provided.',
  details: data.body,
  action_expected: data.action || '',
  department: 'General',
  priority: 'normal',
  status: data.status || 'draft',
});

const normalizeMemoList = (memos) => memos.map(normalizeMemo);

export const memoService = {
  getAll: async () => {
    const response = await api.get('/memos/');
    return { data: normalizeMemoList(response.data) };
  },

  getById: async (id) => {
    const response = await api.get(`/memos/${encodeURIComponent(id)}/`);
    return { data: normalizeMemo(response.data) };
  },

  create: async (data) => {
    const payload = toBackendMemo(data);
    const response = await api.post('/memos/', payload);
    let memo = normalizeMemo(response.data);

    if (data.status === 'submitted') {
      await api.post(`/memos/${encodeURIComponent(memo.id)}/submit/`, { remarks: '' });
      const updated = await api.get(`/memos/${encodeURIComponent(memo.id)}/`);
      memo = normalizeMemo(updated.data);
    }

    return { data: memo };
  },

  updateStatus: async (id, action, note, user) => {
    await api.post(`/memos/${encodeURIComponent(id)}/${action}/`, { remarks: note });
    const updated = await api.get(`/memos/${encodeURIComponent(id)}/`);
    return { data: normalizeMemo(updated.data) };
  },
};

export const getMemo = async (id) => {
  const response = await api.get(`/memos/${encodeURIComponent(id)}/`);
  return { data: normalizeMemo(response.data) };
};

export const createMemo = async (data) => {
  const response = await api.post('/memos/', toBackendMemo(data));
  let memo = normalizeMemo(response.data);

  if (data.status === 'submitted') {
    await api.post(`/memos/${encodeURIComponent(memo.id)}/submit/`, { remarks: '' });
    const updated = await api.get(`/memos/${encodeURIComponent(memo.id)}/`);
    memo = normalizeMemo(updated.data);
  }

  return { data: memo };
};

export const updateMemo = async (id, data) => {
  const payload = toBackendMemo(data);
  const response = await api.patch(`/memos/${encodeURIComponent(id)}/`, payload);
  let memo = normalizeMemo(response.data);

  if (data.status === 'submitted') {
    await api.post(`/memos/${encodeURIComponent(id)}/submit/`, { remarks: '' });
  } else if (data.status === 'checking') {
    await api.post(`/memos/${encodeURIComponent(id)}/check/`, { remarks: '' });
  } else if (data.status === 'approved') {
    await api.post(`/memos/${encodeURIComponent(id)}/approve/`, { remarks: '' });
  } else if (data.status === 'rejected') {
    await api.post(`/memos/${encodeURIComponent(id)}/reject/`, { remarks: '' });
  }

  const updated = await api.get(`/memos/${encodeURIComponent(id)}/`);
  memo = normalizeMemo(updated.data);
  return { data: memo };
};
