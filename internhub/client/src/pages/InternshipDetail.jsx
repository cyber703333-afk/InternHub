import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader, Modal, companyOf, money, fmtDate } from '../components/UI';

export default function InternshipDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [applied, setApplied] = useState(false);
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/internships/${id}`).then((r) => setItem(r.data.item)).catch(() => nav('/internships'));
    if (user?.role === 'student') api.get('/applications/my').then((r) => setApplied(r.data.items.some((a) => a.internship?._id === id))).catch(() => {});
  }, [id, user, nav]);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    const fd = new FormData(); fd.append('coverLetter', cover); if (file) fd.append('resume', file);
    try { await api.post(`/applications/${id}`, fd); toast.success('Application submitted'); setApplied(true); setOpen(false); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  if (!item) return <Loader />;
  const closed = item.status !== 'approved' || (item.deadline && new Date(item.deadline) < new Date());
  return (
    <div className="detail">
      <div className="card">
        <p className="muted"><Link to="/internships">← All internships</Link></p>
        <h1>{item.title}</h1>
        <p className="lead-sm">{companyOf(item.company)}{item.company?.industry ? ` · ${item.company.industry}` : ''}</p>
        <div className="chips">
          <span className="chip">{item.mode}</span>{item.location && <span className="chip">{item.location}</span>}
          {item.duration && <span className="chip">{item.duration}</span>}<span className="chip strong">{money(item.stipend)}</span>
          <span className="chip">{item.openings} opening{item.openings > 1 ? 's' : ''}</span>
        </div>
        <h3>About the role</h3><p className="pre">{item.description}</p>
        <h3>Skills</h3><div className="chips">{item.skills?.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
        {item.company?.description && <><h3>About {companyOf(item.company)}</h3><p className="pre">{item.company.description}</p></>}
      </div>
      <aside className="card side">
        <p className="muted small">Apply by</p><p className="big">{fmtDate(item.deadline)}</p>
        {!user && <Link className="btn" to="/login" state={{ from: `/internships/${id}` }}>Log in to apply</Link>}
        {user?.role === 'student' && (applied ? <button className="btn" disabled>Already applied</button>
          : closed ? <button className="btn" disabled>Applications closed</button>
          : <button className="btn" onClick={() => setOpen(true)}>Apply now</button>)}
        {user && user.role !== 'student' && <p className="muted small">Only student accounts can apply.</p>}
        {applied && <Link to="/student/applications" className="small">Track your application</Link>}
      </aside>
      {open && (
        <Modal title={`Apply to ${item.title}`} onClose={() => setOpen(false)}>
          <form className="form" onSubmit={submit}>
            <label>Cover letter<textarea rows="6" maxLength="2000" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Tell the company why you are a good fit." /></label>
            <label>Resume {user.resume ? '(optional – your profile resume is used by default)' : '(required)'}
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} required={!user.resume} />
            </label>
            <button className="btn" disabled={busy}>{busy ? 'Submitting…' : 'Submit application'}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
