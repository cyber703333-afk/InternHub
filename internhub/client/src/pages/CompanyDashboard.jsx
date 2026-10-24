import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { Stat, Loader, Empty, fmtDate } from '../components/UI';

export default function CompanyDashboard() {
  const [items, setItems] = useState(null);
  const load = () => api.get('/internships/mine').then((r) => setItems(r.data.items));
  useEffect(() => { load(); }, []);

  const toggle = async (i) => {
    try { await api.put(`/internships/${i._id}`, { status: i.status === 'closed' ? 'approved' : 'closed' }); toast.success(i.status === 'closed' ? 'Reopened' : 'Closed'); load(); } catch (e) { toast.error(errMsg(e)); }
  };
  const del = async (i) => {
    if (!window.confirm(`Delete "${i.title}" and all its applications?`)) return;
    try { await api.delete(`/internships/${i._id}`); toast.success('Deleted'); load(); } catch (e) { toast.error(errMsg(e)); }
  };
  if (!items) return <Loader />;
  const applicants = items.reduce((s, i) => s + i.applicants, 0);
  return (
    <>
      <div className="row between"><h1 className="page-title">My postings</h1><Link className="btn" to="/company/internships/new">Post internship</Link></div>
      <div className="stats">
        <Stat label="Postings" value={items.length} />
        <Stat label="Live" value={items.filter((i) => i.status === 'approved').length} />
        <Stat label="Applicants" value={applicants} />
        <Stat label="Waiting for approval" value={items.filter((i) => i.status === 'pending').length} />
      </div>
      {items.length === 0 ? <Empty title="No postings yet" text="Post your first internship and start receiving applications." to="/company/internships/new" cta="Post internship" /> : (
        <div className="card table-wrap"><table>
          <thead><tr><th>Title</th><th>Status</th><th>Deadline</th><th>Applicants</th><th></th></tr></thead>
          <tbody>{items.map((i) => (
            <tr key={i._id}>
              <td><strong>{i.title}</strong><div className="muted small">{i.mode} · {i.location || 'Anywhere'}</div></td>
              <td><span className={`badge s-${i.status}`}>{i.status}</span></td>
              <td>{fmtDate(i.deadline)}</td>
              <td><Link to={`/company/internships/${i._id}/applicants`}>{i.applicants} view</Link></td>
              <td className="actions">
                <Link className="btn ghost sm" to={`/company/internships/${i._id}/edit`}>Edit</Link>
                {i.status !== 'pending' && i.status !== 'rejected' && <button className="btn ghost sm" onClick={() => toggle(i)}>{i.status === 'closed' ? 'Reopen' : 'Close'}</button>}
                <button className="btn danger sm" onClick={() => del(i)}>Delete</button>
              </td>
            </tr>))}</tbody></table></div>
      )}
    </>
  );
}
