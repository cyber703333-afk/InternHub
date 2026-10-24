import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../components/UI';

export default function Profile() {
  const { user, setUser } = useAuth();
  const isCo = user.role === 'company';
  const [f, setF] = useState({ ...user, skills: (user.skills || []).join(', ') });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setBusy(true);
    try { const { data } = await api.put('/auth/me', f); setUser(data.user); toast.success('Profile saved'); } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  const upload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('resume', file);
    try { const { data } = await api.post('/auth/me/resume', fd); setUser(data.user); toast.success('Resume uploaded'); } catch (err) { toast.error(errMsg(err)); }
  };
  const changePw = async (e) => {
    e.preventDefault();
    try { await api.put('/auth/password', pw); toast.success('Password updated'); setPw({ currentPassword: '', newPassword: '' }); } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <>
      <h1 className="page-title">Your profile</h1>
      <div className="two">
        <form className="card form" onSubmit={save}>
          <h3>{isCo ? 'Company details' : 'Personal details'}</h3>
          <label>Name<input value={f.name || ''} onChange={set('name')} required /></label>
          <label>Phone<input value={f.phone || ''} onChange={set('phone')} /></label>
          {isCo ? <>
            <label>Company name<input value={f.companyName || ''} onChange={set('companyName')} required /></label>
            <label>Industry<input value={f.industry || ''} onChange={set('industry')} /></label>
            <label>Website<input value={f.website || ''} onChange={set('website')} /></label>
            <label>Location<input value={f.location || ''} onChange={set('location')} /></label>
            <label>About the company<textarea rows="4" value={f.description || ''} onChange={set('description')} /></label>
          </> : <>
            <label>College<input value={f.college || ''} onChange={set('college')} /></label>
            <label>Course<input value={f.course || ''} onChange={set('course')} /></label>
            <label>Skills (comma separated)<input value={f.skills} onChange={set('skills')} placeholder="React, Node.js, SQL" /></label>
            <label>LinkedIn<input value={f.linkedin || ''} onChange={set('linkedin')} /></label>
            <label>GitHub<input value={f.github || ''} onChange={set('github')} /></label>
            <label>About you<textarea rows="4" value={f.about || ''} onChange={set('about')} /></label>
          </>}
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </form>
        <div>
          {!isCo && (
            <div className="card form">
              <h3>Resume</h3>
              {user.resume ? <p><a href={fileUrl(user.resume)} target="_blank" rel="noreferrer">View current resume</a></p> : <p className="muted">No resume uploaded yet.</p>}
              <label>Upload PDF, DOC or DOCX (max 3 MB)<input type="file" accept=".pdf,.doc,.docx" onChange={upload} /></label>
            </div>
          )}
          <form className="card form" onSubmit={changePw}>
            <h3>Change password</h3>
            <label>Current password<input type="password" required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} /></label>
            <label>New password<input type="password" required minLength="6" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} /></label>
            <button className="btn ghost">Update password</button>
          </form>
        </div>
      </div>
    </>
  );
}
