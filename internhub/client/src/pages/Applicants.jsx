import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { STATUSES } from '../config';
import { Loader, Empty, Modal, StatusBadge, fileUrl, fmtDate } from '../components/UI';

export default function Applicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [view, setView] = useState(null);
  const [filter, setFilter] = useState('');
  const load = () => api.get(`/applications/internship/${id}`).then((r) => setData(r.data));
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [id]);

  const setStatus = async (a, status) => {
    try { await api.put(`/applications/${a._id}/status`, { status }); toast.success(`Marked ${status}`); load(); } catch (e) { toast.error(errMsg(e)); }
  };
  if (!data) return <Loader />;
  const shown = filter ? data.items.filter((a) => a.status === filter) : data.items;
  return (
    <>
      <p className="muted"><Link to="/company">← My postings</Link></p>
      <h1 className="page-title">Applicants for {data.internship.title}</h1>
      <div className="seg wide">
        <button className={!filter ? 'on' : ''} onClick={() => setFilter('')}>All ({data.items.length})</button>
        {STATUSES.map((s) => <button key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>{s}</button>)}
      </div>
      {shown.length === 0 ? <Empty title="No applicants here" text="Applications will appear as students apply." /> : (
        <div className="card table-wrap"><table>
          <thead><tr><th>Student</th><th>College</th><th>Applied</th><th>Status</th><th>Update status</th></tr></thead>
          <tbody>{shown.map((a) => (
            <tr key={a._id}>
              <td><button className="link" onClick={() => setView(a)}>{a.student?.name}</button><div className="muted small">{a.student?.email}</div></td>
              <td>{a.student?.college || '—'}<div className="muted small">{a.student?.course}</div></td>
              <td>{fmtDate(a.createdAt)}</td>
              <td><StatusBadge status={a.status} /></td>
              <td><select value={a.status} onChange={(e) => setStatus(a, e.target.value)} aria-label="Update status">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
            </tr>))}</tbody></table></div>
      )}
      {view && (
        <Modal title={view.student?.name} onClose={() => setView(null)}>
          <dl className="dl">
            <dt>Email</dt><dd>{view.student?.email}</dd>
            <dt>Phone</dt><dd>{view.student?.phone || '—'}</dd>
            <dt>College</dt><dd>{view.student?.college || '—'} {view.student?.course && `· ${view.student.course}`}</dd>
            <dt>Skills</dt><dd>{view.student?.skills?.join(', ') || '—'}</dd>
            <dt>Links</dt><dd>{view.student?.linkedin && <a href={view.student.linkedin} target="_blank" rel="noreferrer">LinkedIn </a>}{view.student?.github && <a href={view.student.github} target="_blank" rel="noreferrer">GitHub</a>}{!view.student?.linkedin && !view.student?.github && '—'}</dd>
            <dt>Resume</dt><dd>{view.resume ? <a href={fileUrl(view.resume)} target="_blank" rel="noreferrer">Open resume</a> : '—'}</dd>
            <dt>Cover letter</dt><dd className="pre">{view.coverLetter || '—'}</dd>
          </dl>
        </Modal>
      )}
    </>
  );
}
