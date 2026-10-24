import { Link } from 'react-router-dom';
import { FILES_URL } from '../config';

export const Loader = () => <div className="loader" role="status" aria-label="Loading" />;
export const Empty = ({ title, text, to, cta }) => (
  <div className="empty">
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {to && <Link className="btn" to={to}>{cta}</Link>}
  </div>
);
export const StatusBadge = ({ status }) => <span className={`badge s-${String(status).toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>;
export const fileUrl = (p) => (p ? (p.startsWith('http') ? p : FILES_URL + p) : null);
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
export const money = (n) => (n ? `₹${Number(n).toLocaleString('en-IN')}/mo` : 'Unpaid');
export const companyOf = (c) => c?.companyName || c?.name || 'Company';

export function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="pager">
      <button className="btn ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {pages}</span>
      <button className="btn ghost" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close">✕</button></div>
        {children}
      </div>
    </div>
  );
}

export function Stat({ label, value, to }) {
  const inner = <><div className="stat-n">{value ?? '–'}</div><div className="stat-l">{label}</div></>;
  return to ? <Link to={to} className="stat">{inner}</Link> : <div className="stat">{inner}</div>;
}

export function Bars({ data, empty = 'No data yet' }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (!data.length) return <p className="muted">{empty}</p>;
  return (
    <div className="bars">
      {data.map((d) => (
        <div className="bar-row" key={d.label}>
          <span className="bar-label">{d.label}</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${(d.value / max) * 100}%` }} /></div>
          <span className="bar-val">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
