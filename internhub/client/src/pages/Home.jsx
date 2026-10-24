import { Link } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext';
import { APP_NAME, STATUSES } from '../config';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero">
        <div>
          <h1>Find the internship. Track every step until the offer.</h1>
          <p className="lead">{APP_NAME} connects students, companies and administrators in one place. Students apply and watch their status change. Companies post roles and review applicants. Admins keep it all running.</p>
          <div className="row">
            {user ? <Link className="btn lg" to={homeFor(user)}>Go to your dashboard</Link> : <><Link className="btn lg" to="/register">Create a free account</Link><Link className="btn ghost lg" to="/internships">Browse internships</Link></>}
          </div>
        </div>
        <div className="pipeline card" aria-label="Example application tracker">
          <p className="muted small">Your application to MERN Stack Developer Intern</p>
          <ol>
            {STATUSES.slice(0, 4).map((s, i) => (
              <li key={s} className={i < 3 ? 'done' : 'now'}><span className="pip" />{s}<em>{['Mon', 'Tue', 'Thu', 'Today'][i]}</em></li>
            ))}
          </ol>
          <p className="small">Every status change reaches you instantly as a notification.</p>
        </div>
      </section>

      <section className="trio">
        <div className="card"><h3>For students</h3><p className="muted">Search by skill, location and stipend. Save roles for later, apply with your resume and follow each application.</p></div>
        <div className="card"><h3>For companies</h3><p className="muted">Post internships in minutes, review applicant profiles and move candidates from review to selection.</p></div>
        <div className="card"><h3>For admins</h3><p className="muted">See platform activity at a glance. Approve postings, manage users and monitor every application.</p></div>
      </section>
    </>
  );
}
