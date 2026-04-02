import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memoService } from '../../services/memoService';
import { useMemos } from '../../hooks/useMemos';
import ActionPanel from '../../components/common/ActionPanel';
import Badge from '../../components/common/Badge';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const MemoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateMemoStatus } = useMemos();
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const res = await memoService.getById(id);
        setMemo(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMemo();
  }, [id]);

  const handleUpdateStatus = async (action, note, user) => {
    try {
      const res = await updateMemoStatus(id, action, note, user);
      setMemo(res);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('memo-document');
    element.classList.add('pdf-exporting');
    
    const opt = {
      margin: 15,
      filename: `Memo_${memo.id}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      await html2pdf().from(element).set(opt).save();
    } finally {
      element.classList.remove('pdf-exporting');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="page">Loading document...</div>;
  if (error || !memo) return <div className="page">Error: {error || 'Memo not found'}</div>;

  return (
    <div className="page">
      <div className="pg-head print-hide">
        <div>
          <button className="btn btn-ghost btn-xs" onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>
            ← Back
          </button>
          <div className="pg-title">Document Detail</div>
          <div className="pg-desc">{memo.id}</div>
        </div>
        
        {memo.status === 'approved' && (
          <div className="pg-actions">
            <button className="btn btn-ghost" onClick={handlePrint}>
              <Printer size={16} /> Print Memo
            </button>
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        )}
      </div>

      <div className="detail-wrap">
        <div className="main-content">
          <div id="memo-document" className={`memo-paper mp-${memo.status}`}>
            <div className="mp-masthead" style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <img src="/NIF.png" alt="NIF Logo" style={{ height: '64px', objectFit: 'contain' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <div className="mp-org-sub" style={{ marginTop: 0 }}>Internal Memorandum</div>
                  <div className="mp-doc-label" style={{ marginTop: 0 }}>{memo.dept} / {memo.priority}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <BarcodePlaceholder id={memo.id} />
                <div style={{ fontSize: '11px', marginTop: '8px', color: 'var(--text-muted)' }}>Date: {memo.date}</div>
              </div>
            </div>

            <dl className="mp-fields">
              <dt>TO:</dt>
              <dd>{memo.to}</dd>
              <dt>THROUGH:</dt>
              <dd>{memo.checker}</dd>
              <dt>FROM:</dt>
              <dd>{memo.from}</dd>
            </dl>

            <div className="mp-subject-line">SUBJECT: {memo.subject}</div>

            <div className="mp-section-title">Background</div>
            <div className="mp-text">{memo.bg}</div>

            <div className="mp-section-title">Purpose</div>
            <div className="mp-text">{memo.purpose}</div>

            <div className="mp-section-title">Details</div>
            <div className="mp-text">{memo.body}</div>

            {memo.action && (
              <>
                <div className="mp-section-title">Action Expected</div>
                <div className="mp-text" style={{ fontWeight: 600, color: 'var(--nepal-blue-dark)' }}>
                  {memo.action}
                </div>
              </>
            )}

            <hr className="mp-hr" />
            
            <div className="mp-sig-row">
              <div className="sig-col">
                <div className={`sig-line ${['submitted', 'checking', 'approved'].includes(memo.status) ? 'signed' : ''}`}></div>
                <div className="sig-name">{memo.from.split(',')[0]}</div>
                <div className="sig-role">Prepared By (Maker)</div>
              </div>
              <div className="sig-col">
                <div className={`sig-line ${['checking', 'approved'].includes(memo.status) ? 'signed' : ''}`}></div>
                <div className="sig-name">{memo.checker.split('—')[0]}</div>
                <div className="sig-role">Reviewed By (Checker)</div>
              </div>
              <div className="sig-col">
                <div className={`sig-line ${memo.status === 'approved' ? 'signed' : ''}`}></div>
                <div className="sig-name">{memo.approver.split('—')[0]}</div>
                <div className="sig-role">Approved By (Approver)</div>
              </div>
            </div>
          </div>

          <ActionPanel memo={memo} onUpdateStatus={handleUpdateStatus} />
        </div>

        <div className="side-panel">
          <div className="side-card">
            <div className="sc-hd">Status Tracking</div>
            <div style={{ marginBottom: '16px' }}>
              <Badge status={memo.status} />
            </div>
            
            <div className="progress-steps">
              {/* Draft Step */}
              <div className="ps-item ps-done">
                <div className="ps-dot"></div>
                <div className="ps-label">Drafted</div>
              </div>
              
              {/* Submit Step */}
              <div className={`ps-item ${['submitted', 'checking', 'approved'].includes(memo.status) ? 'ps-done' : (memo.status === 'draft' ? 'ps-cur' : 'ps-wait')}`}>
                <div className="ps-dot"></div>
                <div className="ps-label">Submitted</div>
              </div>
              
              {/* Check Step */}
              <div className={`ps-item ${['checking', 'approved'].includes(memo.status) ? 'ps-done' : (memo.status === 'submitted' ? 'ps-cur' : 'ps-wait')}`}>
                <div className="ps-dot"></div>
                <div className="ps-label">Checker Review</div>
              </div>
              
              {/* Approve Step */}
              <div className={`ps-item ${memo.status === 'approved' ? 'ps-done' : (memo.status === 'checking' ? 'ps-cur' : 'ps-wait')}`}>
                <div className="ps-dot"></div>
                <div className="ps-label">Final Approval</div>
              </div>
            </div>
          </div>

          <div className="side-card">
            <div className="sc-hd">Timeline & Audit</div>
            <div className="tl">
              {memo.timeline && memo.timeline.map((event, idx) => (
                <div className="tl-item" key={idx}>
                  <div className={`tl-ico ti-${event.t}`}>{event.t.toUpperCase()}</div>
                  <div className="tl-body">
                    <div className="tl-act">{event.text}</div>
                    <div className="tl-meta">{event.date} • {event.by}</div>
                    {event.note && <div className="tl-note">"{event.note}"</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarcodePlaceholder = ({ id }) => (
  <svg width="120" height="30" viewBox="0 0 120 30" style={{ opacity: 0.6 }}>
    {Array.from({ length: 24 }).map((_, i) => (
      <rect key={i} x={i * 5} y="0" width={Math.random() > 0.5 ? 2 : 1} height="30" fill="var(--text-primary)" />
    ))}
  </svg>
);

export default MemoDetail;
