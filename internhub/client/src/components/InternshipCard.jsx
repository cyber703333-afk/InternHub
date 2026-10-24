import { Link } from 'react-router-dom';
import { companyOf, money, fmtDate } from './UI';

export default function InternshipCard({ item, saved, onToggleSave }) {
  return (
    <article className="card intern">
      <div className="intern-top">
        <div>
          <h3><Link to={`/internships/${item._id}`}>{item.title}</Link></h3>
          <p className="muted">{companyOf(item.company)}</p>
        </div>
        {onToggleSave && (
          <button className={`icon-btn ${saved ? 'on' : ''}`} onClick={() => onToggleSave(item._id)} aria-label={saved ? 'Remove from saved' : 'Save internship'} title={saved ? 'Saved' : 'Save'}>
            {saved ? '★' : '☆'}
          </button>
        )}
      </div>
      <div className="chips">
        <span className="chip">{item.mode}</span>
        {item.location && <span className="chip">{item.location}</span>}
        {item.duration && <span className="chip">{item.duration}</span>}
        <span className="chip strong">{money(item.stipend)}</span>
      </div>
      <div className="chips">{(item.skills || []).slice(0, 4).map((s) => <span key={s} className="tag">{s}</span>)}</div>
      <p className="muted small">Apply by {fmtDate(item.deadline)}</p>
    </article>
  );
}
