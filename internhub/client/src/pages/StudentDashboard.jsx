import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Stat, Loader, StatusBadge, Empty, companyOf, fmtDate } from '../components/UI';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState(null);
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    api.get('/applications/my').then((r) => setApps(r.data.items));
    api.get('/saved').then((r) => setSaved(r.data.items)).catch(() => {});
  }, []);
  if (!apps) return <Loader />;
  const count = (s) => apps.filter((a) => a.status === s).length;
  return (
    <>
      <h1 className="page-title">Hello, {user.name.split(' ')[0]}</h1>
      {!user.resume && <div className="notice">Add your resume in <Link to="/profile">your profile</Link> so you can apply in one click.</div>}
      <div className="stats">
        <Stat label="Applied" value={apps.length} to="/student/applications" />
        <Stat label="Shortlisted" value={count('Shortlisted')} to="/student/applications" />
        <Stat label="Selected" value={count('Selected')} to="/student/applications" />
        <Stat label="Saved" value={saved.length} to="/student/saved" />
      </div>
      <h2>Latest applications</h2>
      {apps.length === 0 ? <Empty title="You have not applied yet" text="Find a role that matches your skills and apply in a minute." to="/internships" cta="Browse internships" /> : (
        <div className="card table-wrap"><table>
          <thead><tr><th>Internship</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
          <tbody>{apps.slice(0, 5).map((a) => (
            <tr key={a._id}><td>{a.internship ? <Link to={`/internships/${a.internship._id}`}>{a.internship.title}</Link> : 'Removed'}</td><td>{companyOf(a.internship?.company)}</td><td>{fmtDate(a.createdAt)}</td><td><StatusBadge status={a.status} /></td></tr>
          ))}</tbody></table></div>
      )}
    </>
  );
}
