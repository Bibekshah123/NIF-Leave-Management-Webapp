import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemos } from '../../hooks/useMemos';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';

const Dashboard = () => {
  const navigate = useNavigate();
  const { memos, loading, fetchMemos } = useMemos();

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  // Calculate stats
  const stats = {
    total: memos.length,
    drafts: memos.filter(m => m.status === 'draft').length,
    pending: memos.filter(m => ['submitted', 'checking'].includes(m.status)).length,
    approved: memos.filter(m => m.status === 'approved').length,
    returned: memos.filter(m => m.status === 'rejected').length,
  };

  const recentMemos = memos.slice(0, 5); // top 5 recent

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <div className="pg-title">Memo Dashboard</div>
          <div className="pg-desc">Maker · Checker · Approver — three-level approval workflow</div>
        </div>
        <div className="pg-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/memos/all')}>View registry</button>
          <button className="btn btn-accent" onClick={() => navigate('/memos/new')}>+ Draft New Memo</button>
        </div>
      </div>

      <div className="stat-strip">
        <StatCard title="Total Memos" value={stats.total} subtitle="All documents" />
        <StatCard title="Drafts" value={stats.drafts} subtitle="Being prepared" colorClass="sc-purple" />
        <StatCard title="Pending Action" value={stats.pending} subtitle="Awaiting review" colorClass="sc-yellow" />
        <StatCard title="Approved" value={stats.approved} subtitle="Cleared & filed" colorClass="sc-green" />
        <StatCard title="Returned" value={stats.returned} subtitle="Needs revision" colorClass="sc-red" />
      </div>

      <div className="pipeline-card">
        <div className="pl-lbl">Approval Pipeline — Workflow Stages</div>
        <div className="pl-track">
          <div className="pl-step s-done">
            <div className="pl-node s-done">✓</div>
            <div className="pl-txt s-done">Draft</div>
            <div className="pl-who">Maker</div>
          </div>
          <div className="pl-step s-done">
            <div className="pl-node s-done">✓</div>
            <div className="pl-txt s-done">Submitted</div>
            <div className="pl-who">Maker</div>
          </div>
          <div className="pl-step s-active">
            <div className="pl-node s-warn">3</div>
            <div className="pl-txt s-active">Checker Review</div>
            <div className="pl-who">Checker</div>
          </div>
          <div className="pl-step">
            <div className="pl-node">4</div>
            <div className="pl-txt">Approval</div>
            <div className="pl-who">Approver</div>
          </div>
          <div className="pl-step">
            <div className="pl-node">5</div>
            <div className="pl-txt">Approved & Filed</div>
            <div className="pl-who">Director</div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="tc-top">
          <span className="tc-title">Recent Activity</span>
          <button className="btn btn-ghost btn-xs" onClick={() => navigate('/memos/all')}>View all →</button>
        </div>
        
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>Loading memos...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Subject & Sender</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMemos.map(memo => (
                <tr key={memo.id} className="mrow" onClick={() => navigate(`/memos/${encodeURIComponent(memo.id)}`)}>
                  <td>
                    <div className="ref-no">{memo.id}</div>
                  </td>
                  <td>
                    <div className="memo-subj">{memo.subject}</div>
                    <div className="memo-from">{memo.from}</div>
                  </td>
                  <td>{memo.date}</td>
                  <td>
                    <Badge status={memo.status} />
                  </td>
                </tr>
              ))}
              {recentMemos.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>No recent activity</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
