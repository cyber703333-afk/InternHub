import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { Loader, companyOf, fmtDate } from '../components/UI';

export default function AdminInternships() {
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState('');
  const load = () => api.get('/admin/internships', { params: { status } }).then((r) => setItems(r.data.items));
  useEffect(() => { load(); }, [status]);

  const set = async (i, s) => { try { await api.put(`/admin/internships/${i._id}/status`, { status: s }); toast.success(`Marked ${s}`); load(); } catch (e) { toast.error(errMsg(e)); } };
  const del = async (i) => { if (!window.confirm(`Remove "${i.title}"?`)) return; try { await api.delete(`/internships/${i._id}`); toast.success('Removed'); load(); } catch (e) { toast.error(errMsg(e)); } };
  return (
    <>
      <h1 className="page-title">Manage internships</h1>
      <div className="seg wide">{['', 'pending', 'approved', 'rejected', 'closed'].map((s) => <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>{s || 'All'}</button>)}</div>
      {!items ? <Loader /> : (
        <div className="card table-wrap"><table>
          <thead><tr><th>Title</th><th>Company</th><th>Posted</th><th>Status</th><th></th></tr></thead>
          <tbody>{items.map((i) => (
            <tr key={i._id}>
              <td><Link to={`/internships/${i._id}`}>{i.title}</Link></td><td>{companyOf(i.company)}</td><td>{fmtDate(i.createdAt)}</td>
              <td><span className={`badge s-${i.status}`}>{i.status}</span></td>
              <td className="actions">
                {i.status !== 'approved' && <button className="btn sm" onClick={() => set(i, 'approved')}>Approve</button>}
                {i.status !== 'rejected' && <button className="btn ghost sm" onClick={() => set(i, 'rejected')}>Reject</button>}
                <button className="btn danger sm" onClick={() => del(i)}>Remove</button>
              </td>
            </tr>))}
            {items.length === 0 && <tr><td colSpan="5" className="muted">No internships in this view.</td></tr>}</tbody></table></div>
      )}
    </>
  );
}
