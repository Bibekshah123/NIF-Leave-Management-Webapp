import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createMemo, getMemo, updateMemo } from '../../services/memoService'

const initial = {
  subject: '',
  body: '',
  author: '',
  assignee: '',
  status: 'draft',
}

export default function NewMemoForm() {
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const editMode = Boolean(id)

  useEffect(() => {
    if (!editMode) return

    setLoading(true)
    ;(async () => {
      try {
        const memo = await getMemo(id)
        setValues({
          subject: memo.subject || '',
          body: memo.body || '',
          author: memo.author || '',
          assignee: memo.assignee || '',
          status: memo.status || 'draft',
        })
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [editMode, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (editMode) {
        await updateMemo(id, values)
      } else {
        await createMemo(values)
      }
      navigate('/')
    } catch (err) {
      setError(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading memo for edit...</p>
  }

  return (
    <section className="new-memo-form paper">
      <h1>{editMode ? 'Edit memo' : 'Create new memo'}</h1>
      {error && <p className="error">{error.message || 'Submit failed'}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Subject
          <input name="subject" value={values.subject} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea name="body" value={values.body} onChange={handleChange} rows={8} required />
        </label>

        <label>
          Author
          <input name="author" value={values.author} onChange={handleChange} required />
        </label>

        <label>
          Assignee
          <input name="assignee" value={values.assignee} onChange={handleChange} required />
        </label>

        <label>
          Workflow state
          <select name="status" value={values.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : editMode ? 'Save Changes' : 'Create Memo'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
