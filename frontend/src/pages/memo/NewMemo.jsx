import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMemos } from '../../hooks/useMemos';

const NewMemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createMemo, loading } = useMemos();

  const [formData, setFormData] = useState({
    from: `${user.name}, ${user.title}`,
    to: '',
    subject: '',
    dept: 'Programs',
    priority: 'Normal',
    bg: '',
    purpose: '',
    body: '',
    action: '',
    checker: '',
    approver: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id.replace('n-', '')]: e.target.value });
  };

  const handleCreate = async (isDraft) => {
    if (!formData.subject || !formData.to || !formData.purpose) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const newMemo = await createMemo({ ...formData, isDraft });
      navigate(`/memos/${encodeURIComponent(newMemo.id)}`);
    } catch (err) {
      alert('Error creating memo: ' + err.message);
    }
  };

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <button className="btn btn-ghost btn-xs" onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>
            ← Back
          </button>
          <div className="pg-title">Draft New Internal Memo</div>
          <div className="pg-desc">Complete all required fields <span className="req">*</span></div>
        </div>
      </div>

      <div className="table-card" style={{ padding: '32px' }}>
        <div className="fsec" style={{ marginTop: 0 }}>Document Header</div>

        <div className="fgrid">
          <div className="fg">
            <label>From (Maker) <span className="req">*</span></label>
            <input type="text" id="n-from" value={formData.from} onChange={handleChange} placeholder="Full name, designation" />
          </div>
          <div className="fg">
            <label>To (Recipient) <span className="req">*</span></label>
            <input type="text" id="n-to" value={formData.to} onChange={handleChange} placeholder="Full name, designation" />
          </div>
        </div>

        <div className="fg">
          <label>Subject <span className="req">*</span></label>
          <input type="text" id="n-subject" value={formData.subject} onChange={handleChange} placeholder="Clear, concise subject line" />
        </div>

        <div className="fgrid">
          <div className="fg">
            <label>Department / Unit</label>
            <select id="n-dept" value={formData.dept} onChange={handleChange}>
              <option>Programs</option>
              <option>Technical</option>
              <option>Administration</option>
              <option>Finance</option>
              <option>Legal</option>
            </select>
          </div>
          <div className="fg">
            <label>Priority</label>
            <select id="n-priority" value={formData.priority} onChange={handleChange}>
              <option>Normal</option>
              <option>Urgent</option>
              <option>Confidential</option>
            </select>
          </div>
        </div>

        <div className="fsec">Memo Body</div>
        <div className="fg">
          <label>Background & Context</label>
          <textarea id="n-bg" value={formData.bg} onChange={handleChange} placeholder="Provide relevant background..."></textarea>
        </div>
        <div className="fg">
          <label>Purpose / Objective <span className="req">*</span></label>
          <textarea id="n-purpose" value={formData.purpose} onChange={handleChange} placeholder="State clearly what this memo is seeking..."></textarea>
        </div>
        <div className="fg">
          <label>Details</label>
          <textarea id="n-body" value={formData.body} onChange={handleChange} placeholder="Key facts, figures, or supporting information..." style={{ minHeight: '90px' }}></textarea>
        </div>
        <div className="fg">
          <label>Action Required</label>
          <textarea id="n-action" value={formData.action} onChange={handleChange} placeholder="What specific action is expected?"></textarea>
        </div>

        <div className="fsec">Routing</div>
        <div className="fgrid">
          <div className="fg">
            <label>Assign Checker <span className="req">*</span></label>
            <select id="n-checker" value={formData.checker} onChange={handleChange}>
              <option value="">Select checker...</option>
              <option value="Bikash Kadayat — IT Assistant">Bikash Kadayat — IT Assistant</option>
              <option value="Kunsang Lama — IT Assistant Trainee">Kunsang Lama — IT Assistant Trainee</option>
              <option value="Subresh Thakulla — IT Officer">Subresh Thakulla — IT Officer</option>
              <option value="Bibek Shah - IT Assistant Officer">Bibek Shah — IT Assisntant Officer</option>
            </select>
          </div>
          <div className="fg">
            <label>Assign Approver <span className="req">*</span></label>
            <select id="n-approver" value={formData.approver} onChange={handleChange}>
              <option value="">Select approver...</option>
              <option value="Bikram Shrestha — President">Bikram Shrestha — President</option>
              <option value="Bikash Khatri — Program Director">Bikash Khatri — Program  Director</option>
            </select>
          </div>
        </div>

        <div className="fg">
          <label>Internal Notes</label>
          <textarea id="n-notes" value={formData.notes} onChange={handleChange} placeholder="Any confidential notes for reviewers..." style={{ minHeight: '50px' }}></textarea>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
          <button className="btn btn-ghost" onClick={() => handleCreate(true)} disabled={loading}>Save as Draft</button>
          <button className="btn btn-accent" onClick={() => handleCreate(false)} disabled={loading}>Submit for Review →</button>
        </div>
      </div>
    </div>
  );
};

export default NewMemo;
