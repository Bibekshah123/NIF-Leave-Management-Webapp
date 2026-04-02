import React, { useEffect } from 'react';
import { useLeaves } from '../../hooks/useLeaves';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/common/Badge';

const PendingApprovals = () => {
  const { leaves, loading, fetchLeaves, updateLeaveStatus } = useLeaves();
  const { role } = useAuth();

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (role !== 'approver' && role !== 'admin') {
    return (
      <div className="page">
        <div className="pg-head">
          <div>
            <div className="pg-title">Access Denied</div>
            <div className="pg-desc">Only approvers may review pending leave approvals.</div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">!</div>
          <div className="empty-msg">You do not have permission to view this page.</div>
        </div>
      </div>
    );
  }

  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <div className="pg-title">Pending Approvals</div>
          <div className="pg-desc">Review and approve team leave applications</div>
        </div>
      </div>
      
      {loading ? (
        <div>Loading pending items...</div>
      ) : pendingLeaves.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <div className="empty-msg">You have no pending approvals.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {pendingLeaves.map(leave => (
            <div key={leave.id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '20px', boxShadow: 'var(--shadow)'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px'}}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--nepal-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {leave.employee.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                     <div style={{ fontWeight: 600, fontSize: '15px'}}>{leave.employee}</div>
                     <div style={{ fontSize: '12px', color: 'var(--text-muted)'}}>{leave.type} • Applied on {leave.applied}</div>
                   </div>
                </div>
                <div><Badge status={leave.status} /></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', marginBottom: '20px'}}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px'}}>Dates</div>
                  <div>{leave.start} to {leave.end} <span style={{ color: 'var(--text-muted)' }}>({leave.days} days)</span></div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px'}}>Reason</div>
                  <div>{leave.reason}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px'}}>
                <button className="btn btn-ghost" style={{ borderColor: 'var(--nepal-red)', color: 'var(--nepal-red)'}} onClick={() => handleAction(leave.id, 'rejected')}>Reject</button>
                <button className="btn btn-success" onClick={() => handleAction(leave.id, 'approved')}>Approve ✓</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
