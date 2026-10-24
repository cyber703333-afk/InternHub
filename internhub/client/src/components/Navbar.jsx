import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext';
import api from '../api';
import { APP_NAME } from '../config';

function Bell() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ items: [], unread: 0 });
  const nav = useNavigate();
  const load = () => api.get('/notifications').then((r) => setData(r.data)).catch(() => {});
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, []);
  const toggle = async () => {
    setOpen(!open);
    if (!open && data.unread) { await api.put('/notifications/read-all'); setTimeout(load, 600); }
  };
  return (
    <div className="bell">
      <button className="icon-btn" onClick={toggle} aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>
        {data.unread > 0 && <span className="dot">{data.unread}</span>}
      </button>
      {open && (
        <div className="bell-menu">
          {data.items.length === 0 && <p className="muted pad">No notifications yet.</p>}
          {data.items.map((n) => (
            <button key={n._id} className={`bell-item ${n.read ? '' : 'unread'}`} onClick={() => { setOpen(false); n.link && nav(n.link); }}>
              {n.message}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menu, setMenu] = useState(false);
  const links = !user ? [] : user.role === 'student'
    ? [['/student', 'Dashboard'], ['/internships', 'Browse'], ['/student/applications', 'Applications'], ['/student/saved', 'Saved']]
    : user.role === 'company'
      ? [['/company', 'My postings'], ['/company/internships/new', 'Post internship']]
      : [['/admin', 'Overview'], ['/admin/users', 'Users'], ['/admin/internships', 'Internships'], ['/admin/applications', 'Applications']];
  return (
    <header className="nav">
      <div className="nav-in">
        <Link to={user ? homeFor(user) : '/'} className="brand"><span className="brand-mark">▮</span>{APP_NAME}</Link>
        <button className="icon-btn burger" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
        <nav className={`nav-links ${menu ? 'open' : ''}`} onClick={() => setMenu(false)}>
          {!user && <NavLink to="/internships">Browse internships</NavLink>}
          {links.map(([to, label]) => <NavLink key={to} to={to} end>{label}</NavLink>)}
        </nav>
        <div className="nav-right">
          {!user ? (
            <><Link className="btn ghost" to="/login">Log in</Link><Link className="btn" to="/register">Sign up</Link></>
          ) : (
            <>
              <Bell />
              {user.role !== 'admin' && <Link className="who" to="/profile">{user.companyName || user.name}</Link>}
              {user.role === 'admin' && <span className="who">Admin</span>}
              <button className="btn ghost" onClick={() => { logout(); nav('/'); }}>Log out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
