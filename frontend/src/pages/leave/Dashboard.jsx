import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaves } from '../../hooks/useLeaves';
import LeaveCard from '../../components/common/LeaveCard';
import { CalendarDays, Stethoscope, Briefcase, Plane, Plus, ArrowRight } from 'lucide-react';

const LeaveDashboard = () => {
  const navigate = useNavigate();
  const { leaves, loading, fetchLeaves } = useLeaves();

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  const recent = leaves.slice(0, 4);

  return (
    <div className="page" style={{ paddingBottom: '80px' }}>
      <div className="pg-head">
        <div>
          <div className="pg-title">Leave Dashboard</div>
          <div className="pg-desc">Manage your leave balance and applications</div>
        </div>
        <div className="pg-actions">
          <button className="btn btn-primary" onClick={() => navigate('/leave/apply')}>
            <Plus size={18} /> Apply for Leave
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '32px' }}>
        
        {/* MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Balances Section */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Playfair Display", serif' }}>My Balances</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {/* Annual Leave */}
              <div className="balance-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="bc-type">Annual Leave</div>
                  <CalendarDays size={18} color="var(--brand-blue)" />
                </div>
                <div className="bc-used">18</div>
                <div style={{ background: 'var(--bg-main)', height: '8px', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--brand-blue)', height: '100%', width: '60%', borderRadius: '4px' }}></div>
                </div>
                <div className="bc-total" style={{ marginTop: '12px' }}>
                  Remaining: <span style={{ fontWeight: 600, color: 'var(--text-primary)'}}>12</span> / 30 days
                </div>
              </div>

              {/* Sick Leave */}
              <div className="balance-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="bc-type">Sick Leave</div>
                  <Stethoscope size={18} color="var(--brand-red)" />
                </div>
                <div className="bc-used">5</div>
                <div style={{ background: 'var(--bg-main)', height: '8px', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--brand-red)', height: '100%', width: '41.6%', borderRadius: '4px' }}></div>
                </div>
                <div className="bc-total" style={{ marginTop: '12px' }}>
                  Remaining: <span style={{ fontWeight: 600, color: 'var(--text-primary)'}}>7</span> / 12 days
                </div>
              </div>

              {/* Casual Leave */}
              <div className="balance-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="bc-type">Casual Leave</div>
                  <Briefcase size={18} color="var(--success)" />
                </div>
                <div className="bc-used">3</div>
                <div style={{ background: 'var(--bg-main)', height: '8px', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--success)', height: '100%', width: '30%', borderRadius: '4px' }}></div>
                </div>
                <div className="bc-total" style={{ marginTop: '12px' }}>
                  Remaining: <span style={{ fontWeight: 600, color: 'var(--text-primary)'}}>7</span> / 10 days
                </div>
              </div>
            </div>
          </section>

          {/* Recent Applications Section */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"Playfair Display", serif' }}>Recent Applications</h3>
              <button 
                onClick={() => navigate('/leave/my-applications')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-blue)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                View full history <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="table-card" style={{ padding: '24px' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading records...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recent.map(leave => <LeaveCard key={leave.id} leave={leave} />)}
                  {recent.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No recent applications found.</div>}
                </div>
              )}
            </div>
          </section>

        </div>

        {/* SIDEBAR COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Year to Date Widget */}
          <div className="side-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--text-muted)' }}>Year to Date</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(39, 64, 149, 0.05)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '32px', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--brand-blue)', lineHeight: 1 }}>{stats.total}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '8px' }}>Total</div>
              </div>
              <div style={{ background: 'var(--warning-bg)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '32px', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--warning)', lineHeight: 1 }}>{stats.pending}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--warning-text)', marginTop: '8px' }}>Pending</div>
              </div>
              <div style={{ background: 'var(--success-bg)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '32px', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--success)', lineHeight: 1 }}>{stats.approved}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success-text)', marginTop: '8px' }}>Approved</div>
              </div>
              <div style={{ background: 'var(--danger-bg)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '32px', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--danger)', lineHeight: 1 }}>{stats.rejected}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--danger-text)', marginTop: '8px' }}>Rejected</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="side-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px', color: 'var(--text-muted)' }}>Quick Actions</h3>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '16px', padding: '16px', fontSize: '14px' }} onClick={() => navigate('/leave/apply')}>
              <CalendarDays size={18} color="var(--brand-blue)" /> Request Annual Leave
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '16px', padding: '16px', fontSize: '14px' }} onClick={() => navigate('/leave/apply')}>
              <Stethoscope size={18} color="var(--brand-red)" /> Report Sick Leave
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '16px', fontSize: '14px' }} onClick={() => navigate('/leave/apply')}>
              <Briefcase size={18} color="var(--success)" /> Other Leave Types
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;
