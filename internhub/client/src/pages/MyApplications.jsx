import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { STATUSES } from '../config';
import { Loader, Empty, StatusBadge, companyOf, fmtDate } from '../components/UI';

function Tracker({ status, history = [] }) {
  const rejected = status === 'Rejected';
  const steps = rejected ? ['Applied', 'Under Review', 'Rejected'] : ['Applied', 'Under Review', 'Shortlisted', 'Selected'];
  const idx = steps.indexOf(status);
  return (
    <ol className="track">
      {steps.map((s, i) => {
        const h = history.find((x) => x.status === s);
        return <li key={s} className={`${i <= idx ? 'done' : ''} ${i === idx ? 'now' : ''} ${rejected && s === 'Rejected' ? 'bad' : ''}`}><span className="pip" />{s}{h && <em>{fmtDate(h.at)}</em>}</li>;
      })}
    </ol>
  );
}

export default function MyApplications() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('');
  const load = () => api.get('/applications/my').then((r) => setItems(r.data.items));
  // Real-time tracking: refresh every 10 seconds
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, []);

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try { await api.delete(`/applications/${id}`); toast.success('Application withdrawn'); load(); } catch (e) { toast.error(errMsg(e)); }
  };
  if (!items) return <Loader />;
  const shown = filter ? items.filter((a) => a.status === filter) : items;
  return (
    <>
      <h1 className="page-title">My applications</h1>
      <p className="muted small">This page refreshes automatically, so new status changes appear without reloading.</p>
      <div className="seg wide">
        <button className={!filter ? 'on' : ''} onClick={() => setFilter('')}>All ({items.length})</button>
        {STATUSES.map((s) => <button key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>{s}</button>)}
      </div>
      {shown.length === 0 ? <Empty title="Nothing here" text="No applications with this status." to="/internships" cta="Browse internships" /> : shown.map((a) => (
        <article key={a._id} className="card app">
          <div className="app-top">
            <div>
              <h3>{a.internship ? <Link to={`/internships/${a.internship._id}`}>{a.internship.title}</Link> : 'Internship removed'}</h3>
              <p className="muted small">{companyOf(a.internship?.company)} · Applied {fmtDate(a.createdAt)}</p>
            </div>
            <StatusBadge status={a.status} />
          </div>
          <Tracker status={a.status} history={a.history} />
          {a.status === 'Applied' && <button className="btn ghost sm" onClick={() => withdraw(a._id)}>Withdraw</button>}
        </article>
      ))}
    </>
  );
}
