import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, homeFor } from '../context/AuthContext';
import { errMsg } from '../api';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ role: 'student', name: '', email: '', password: '', confirm: '', companyName: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (f.password.length < 6) return setError('Password must be at least 6 characters.');
    if (f.password !== f.confirm) return setError('Passwords do not match.');
    setBusy(true);
    try { const u = await register({ role: f.role, name: f.name, email: f.email, password: f.password, companyName: f.companyName, phone: f.phone }); toast.success('Account created'); nav(homeFor(u)); }
    catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <div className="auth card">
      <h2>Create your account</h2>
      <div className="seg" role="tablist">
        {['student', 'company'].map((r) => <button type="button" key={r} className={f.role === r ? 'on' : ''} onClick={() => setF({ ...f, role: r })}>{r === 'student' ? 'I am a student' : 'I am a company'}</button>)}
      </div>
      <form onSubmit={submit} className="form">
        <label>{f.role === 'company' ? 'Contact person' : 'Full name'}<input required value={f.name} onChange={set('name')} /></label>
        {f.role === 'company' && <label>Company name<input required value={f.companyName} onChange={set('companyName')} /></label>}
        <label>Email<input type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label>Phone (optional)<input value={f.phone} onChange={set('phone')} /></label>
        <label>Password<input type="password" required value={f.password} onChange={set('password')} autoComplete="new-password" /></label>
        <label>Confirm password<input type="password" required value={f.confirm} onChange={set('confirm')} autoComplete="new-password" /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="muted small">Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}
