import { Link } from 'react-router-dom'
import { useMemos } from '../../hooks/useMemos'

const statusStyles = {
  draft: 'badge badge-warning',
  submitted: 'badge badge-info',
  approved: 'badge badge-success',
  rejected: 'badge badge-danger',
}

const formatDate = (iso) => new Date(iso).toLocaleString()

export default function MemoDashboard() {
  const { memos, loading, error, refresh } = useMemos()

  return (
    <main className="memo-dashboard">
      <header>
        <h1>Memo Dashboard</h1>
        <div>
          <Link to="/memo/new" className="btn btn-primary">
            New Memo
          </Link>
          <button onClick={refresh} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </header>

      {loading && <p>Loading memos...</p>}
      {error && <p className="error">Failed to load memos: {error.message}</p>}

      <section className="memo-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {memos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No memos found.
                </td>
              </tr>
            ) : (
              memos.map((memo) => (
                <tr key={memo.id}>
                  <td>{memo.id}</td>
                  <td>{memo.subject}</td>
                  <td>
                    <span className={statusStyles[memo.status] || 'badge'}>
                      {memo.status}
                    </span>
                  </td>
                  <td>{formatDate(memo.updatedAt || memo.createdAt)}</td>
                  <td>
                    <Link to={`/memo/${memo.id}`} className="btn btn-sm">
                      View
                    </Link>
                    {memo.status === 'draft' && (
                      <Link to={`/memo/${memo.id}/edit`} className="btn btn-sm">
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}
