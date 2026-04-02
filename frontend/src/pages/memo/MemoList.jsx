import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemos } from '../../hooks/useMemos';
import Badge from '../../components/common/Badge';

const MemoList = ({ filter = 'all' }) => {
  const navigate = useNavigate();
  const { memos, loading, fetchMemos } = useMemos();
  const [currentFilter, setCurrentFilter] = useState(filter);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  // Update current filter if props change
  useEffect(() => {
    setCurrentFilter(filter);
  }, [filter]);

  const filteredMemos = memos.filter(memo => {
    // Stage 1: Filter by category
    let matchesFilter = true;
    if (currentFilter === 'drafts') matchesFilter = memo.status === 'draft';
    else if (currentFilter === 'submitted') matchesFilter = memo.status === 'submitted';
    else if (currentFilter === 'checking') matchesFilter = memo.status === 'checking';
    else if (currentFilter === 'approved') matchesFilter = memo.status === 'approved';
    else if (currentFilter === 'rejected') matchesFilter = memo.status === 'rejected';

    // Stage 2: Filter by search
    let matchesSearch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      matchesSearch = 
        memo.subject.toLowerCase().includes(q) || 
        memo.id.toLowerCase().includes(q) || 
        memo.from.toLowerCase().includes(q);
    }

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <div className="pg-title">{currentFilter === 'drafts' ? 'My Drafts' : 'Memo Registry'}</div>
          <div className="pg-desc">
            {currentFilter === 'drafts' 
              ? 'Continue working on your draft memos' 
              : 'All internal memos — browse, filter and manage'}
          </div>
        </div>
        <div className="pg-actions">
          <button className="btn btn-accent" onClick={() => navigate('/memos/new')}>+ Draft New Memo</button>
        </div>
      </div>

      <div className="table-card">
        <div className="tc-top">
          <span className="tc-title">Memos</span>
          <div className="filter-row">
            <button className={`ftag ${currentFilter === 'all' ? 'on' : ''}`} onClick={() => setCurrentFilter('all')}>All</button>
            <button className={`ftag ${currentFilter === 'drafts' ? 'on' : ''}`} onClick={() => setCurrentFilter('drafts')}>Draft</button>
            <button className={`ftag ${currentFilter === 'submitted' ? 'on' : ''}`} onClick={() => setCurrentFilter('submitted')}>Submitted</button>
            <button className={`ftag ${currentFilter === 'checking' ? 'on' : ''}`} onClick={() => setCurrentFilter('checking')}>Checking</button>
            <button className={`ftag ${currentFilter === 'approved' ? 'on' : ''}`} onClick={() => setCurrentFilter('approved')}>Approved</button>
            <button className={`ftag ${currentFilter === 'rejected' ? 'on' : ''}`} onClick={() => setCurrentFilter('rejected')}>Returned</button>
          </div>
        </div>
        
        <div className="search-row">
          <span className="search-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
          <input 
            className="s-input" 
            type="text" 
            placeholder="Search by subject, reference, or sender..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>Loading memos...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Subject & Sender</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMemos.map(memo => (
                <tr key={memo.id} className="mrow" onClick={() => navigate(`/memos/${encodeURIComponent(memo.id)}`)}>
                  <td>
                    <div className="ref-no">{memo.id}</div>
                  </td>
                  <td>
                    <div className="memo-subj">{memo.subject}</div>
                    <div className="memo-from">{memo.from}</div>
                  </td>
                  <td>{memo.priority}</td>
                  <td>{memo.date}</td>
                  <td>
                    <Badge status={memo.status} />
                  </td>
                </tr>
              ))}
              {filteredMemos.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    No memos found matching your criteria.
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

export default MemoList;
