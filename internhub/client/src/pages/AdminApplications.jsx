import { useEffect, useState } from 'react';
import api from '../api';
import { Loader, StatusBadge, companyOf, fmtDate } from '../components/UI';

export default function AdminApplications() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get('/admin/applications').then((r) => setItems(r.data.items)); }, []);
  if (!items) return <Loader />;
  return (
    <>
      <h1 className="page-title">All applications</h1>
      <div className="card table-wrap"><table>
        <thead><tr><th>Student</th><th>Internship</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
        <tbody>{items.map((a) => (
          <tr key={a._id}><td>{a.student?.name}<div className="muted small">{a.student?.email}</div></td><td>{a.internship?.title}</td><td>{companyOf(a.company)}</td><td>{fmtDate(a.createdAt)}</td><td><StatusBadge status={a.status} /></td></tr>
        ))}{items.length === 0 && <tr><td colSpan="5" className="muted">No applications yet.</td></tr>}</tbody></table></div>
    </>
  );
}
