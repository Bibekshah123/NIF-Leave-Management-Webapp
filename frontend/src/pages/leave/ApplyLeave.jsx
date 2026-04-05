import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaves } from '../../hooks/useLeaves';
import { useAuth } from '../../hooks/useAuth';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const { applyLeave, loading } = useLeaves();
  const { role } = useAuth();

  const [formData, setFormData] = useState({
    type: 'Annual Leave',
    priority: 'Normal',
    start: '',
    end: '',
    manager: 'Sita Koirala — Programme Manager',
    contact: '',
    reason: '',
    handover: ''
  });

  if (role !== 'maker' && role !== 'admin') {
    return (
      <div className="page">
        <div className="pg-head">
          <div>
            <div className="pg-title">Access Denied</div>
            <div className="pg-desc">Only makers may apply for leave.</div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">!</div>
          <div className="empty-msg">You do not have permission to submit leave applications.</div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id.replace('lv-', '')]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.start || !formData.end || !formData.reason) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await applyLeave(formData);
      navigate('/leave/my-applications');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <div className="pg-title">Apply for Leave</div>
          <div className="pg-desc">Submit a new leave application for approval</div>
        </div>
      </div>

      <div className="table-card" style={{ padding: '24px' }}>
        <div className="fgrid">
          <div className="fg">
            <label>Leave Type <span className="req">*</span></label>
            <select id="lv-type" value={formData.type} onChange={handleChange}>
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Unpaid Leave</option>
              <option>Work from Home</option>
            </select>
          </div>
          <div className="fg">
            <label>Priority</label>
            <select id="lv-priority" value={formData.priority} onChange={handleChange}>
              <option>Normal</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>
        <div className="fgrid">
          <div className="fg">
            <label>Start Date <span className="req">*</span></label>
            <input type="date" id="lv-start" value={formData.start} onChange={handleChange} />
          </div>
          <div className="fg">
            <label>End Date <span className="req">*</span></label>
            <input type="date" id="lv-end" value={formData.end} onChange={handleChange} />
          </div>
        </div>
        <div className="fgrid">
          <div className="fg">
            <label>Reporting Manager <span className="req">*</span></label>
            <select id="lv-manager" value={formData.manager} onChange={handleChange}>
              <option>Bikash Kadayat — IT Assistant</option>
              <option>Bikash Khatri— Program Director</option>
              <option>Bikram Shrestha — President</option>
            </select>
          </div>
          <div className="fg">
            <label>Contact During Leave</label>
            <input type="text" id="lv-contact" placeholder="Phone or email" value={formData.contact} onChange={handleChange} />
          </div>
        </div>
        <div className="fg">
          <label>Reason for Leave <span className="req">*</span></label>
          <textarea id="lv-reason" placeholder="Provide detailed reason for your leave application..." value={formData.reason} onChange={handleChange}></textarea>
        </div>
        <div className="fg">
          <label>Work Handover Notes</label>
          <textarea id="lv-handover" placeholder="Describe any pending tasks or handover instructions..." style={{ minHeight: '60px' }} value={formData.handover} onChange={handleChange}></textarea>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
