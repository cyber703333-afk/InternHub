import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, homeFor } from '../context/AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try { const u = await login(f.email, f.password); toast.success(`Welcome back, ${u.name.split(' ')[0]}`); nav(loc.state?.from || homeFor(u)); }
    catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <div className="auth card">
      <h2>Log in</h2>
      <form onSubmit={submit} className="form">
        <label>Email<input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></label>
        <label>Password<input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="muted small">New here? <Link to="/register">Create an account</Link></p>
      <details className="demo"><summary>Demo accounts</summary>
        <p className="small">Student: student@demo.com / Student@123<br />Company: company@demo.com / Company@123<br />Admin: admin@internhub.com / Admin@123</p>
      </details>
    </div>
  );
}
