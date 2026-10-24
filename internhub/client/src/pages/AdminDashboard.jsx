import { useEffect, useState } from 'react';
import api from '../api';
import { Stat, Loader, Bars, StatusBadge, fmtDate } from '../components/UI';

export default function AdminDashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get('/admin/stats').then((r) => setD(r.data)); }, []);
  if (!d) return <Loader />;
  const t = d.totals;
  return (
    <>
      <h1 className="page-title">Platform overview</h1>
      <div className="stats">
        <Stat label="Students" value={t.students} to="/admin/users" />
        <Stat label="Companies" value={t.companies} to="/admin/users" />
        <Stat label="Internships" value={t.internships} to="/admin/internships" />
        <Stat label="Applications" value={t.applications} to="/admin/applications" />
        <Stat label="Awaiting approval" value={t.pendingInternships} to="/admin/internships" />
      </div>
      <div className="two">
        <div className="card"><h3>Applications by status</h3><Bars data={d.byStatus} /></div>
        <div className="card"><h3>Internships by category</h3><Bars data={d.byCategory} /></div>
      </div>
      <h2>Recent applications</h2>
      <div className="card table-wrap"><table>
        <thead><tr><th>Student</th><th>Internship</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>{d.recent.map((a) => <tr key={a._id}><td>{a.student?.name}</td><td>{a.internship?.title}</td><td>{fmtDate(a.createdAt)}</td><td><StatusBadge status={a.status} /></td></tr>)}
          {d.recent.length === 0 && <tr><td colSpan="4" className="muted">No applications yet.</td></tr>}</tbody></table></div>
    </>
  );
}
