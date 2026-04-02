import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaves } from '../../hooks/useLeaves';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/common/Badge';

const MyApplications = () => {
  const navigate = useNavigate();
  const { leaves, loading, fetchLeaves } = useLeaves();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const myLeaves = leaves.filter(l => l.employee === user.name && (filter === 'all' || l.status === filter));

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <div className="pg-title">My Applications</div>
          <div className="pg-desc">Track all your leave applications</div>
        </div>
        <div className="pg-actions">
          <button className="btn btn-accent" onClick={() => navigate('/leave/apply')}>+ New Application</button>
        </div>
      </div>
      <div className="table-card">
        <div className="tc-top">
          <span className="tc-title">Applications</span>
          <div className="filter-row">
            <button className={`ftag ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`ftag ${filter === 'pending' ? 'on' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
            <button className={`ftag ${filter === 'approved' ? 'on' : ''}`} onClick={() => setFilter('approved')}>Approved</button>
            <button className={`ftag ${filter === 'rejected' ? 'on' : ''}`} onClick={() => setFilter('rejected')}>Rejected</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>Loading applications...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Leave Details</th>
                <th>Dates</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map(leave => (
                <tr key={leave.id} className="mrow">
                  <td>
                    <div className="ref-no">{leave.id}</div>
                    <div className="memo-from">{leave.applied}</div>
                  </td>
                  <td>
                    <div className="memo-subj">{leave.type}</div>
                    <div className="memo-from">{leave.reason}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{leave.start} to {leave.end}</div>
                    <div className="memo-from">{leave.days} Days</div>
                  </td>
                  <td>
                    <Badge status={leave.status} />
                  </td>
                </tr>
              ))}
              {myLeaves.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
