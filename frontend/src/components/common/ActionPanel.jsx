import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ActionPanel = ({ memo, onUpdateStatus }) => {
  const { role, user } = useAuth();
  const [note, setNote] = useState('');

  if (!memo) return null;

  // Determine what actions are available based on role and memo status
  let actions = [];
  
  if (role === 'maker' && memo.status === 'draft') {
    actions = [
      { id: 'submit', label: 'Submit for Review →', btnClass: 'btn-accent' }
    ];
  } else if (role === 'checker' && memo.status === 'submitted') {
    actions = [
      { id: 'check', label: 'Verify & Forward →', btnClass: 'btn-success' },
      { id: 'return', label: 'Return for Revision', btnClass: 'btn-ghost', isDanger: true }
    ];
  } else if (role === 'approver' && memo.status === 'checking') {
    actions = [
      { id: 'approve', label: 'Approve Document ✓', btnClass: 'btn-success' },
      { id: 'return', label: 'Return for Revision', btnClass: 'btn-ghost', isDanger: true }
    ];
  }

  if (actions.length === 0) return null;

  return (
    <div className="action-panel">
      <div className="ap-hd">Take Action - {role.charAt(0).toUpperCase() + role.slice(1)}</div>
      <textarea 
        className="ap-ta" 
        placeholder="Add remarks or internal notes (optional)..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="ap-btns">
        {actions.map(action => (
          <button 
            key={action.id}
            className={`btn ${action.btnClass}`}
            style={action.isDanger ? { borderColor: 'var(--nepal-red)', color: 'var(--nepal-red)' } : {}}
            onClick={() => onUpdateStatus(action.id, note, `${user.name} (${role})`)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionPanel;
