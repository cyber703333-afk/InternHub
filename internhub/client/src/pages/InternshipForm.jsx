import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { CATEGORIES, MODES } from '../config';
import { Loader } from '../components/UI';

const blank = { title: '', description: '', category: 'Web Development', skills: '', stipend: '', duration: '', location: '', mode: 'Onsite', openings: 1, deadline: '' };

export default function InternshipForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(blank);
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (!id) return;
    api.get(`/internships/${id}`).then((r) => {
      const i = r.data.item;
      setF({ ...blank, ...i, skills: (i.skills || []).join(', '), deadline: i.deadline ? i.deadline.slice(0, 10) : '' });
    }).catch(() => nav('/company')).finally(() => setLoading(false));
  }, [id, nav]);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const body = { ...f, stipend: Number(f.stipend) || 0, openings: Number(f.openings) || 1 };
      delete body.company; delete body.status;
      id ? await api.put(`/internships/${id}`, body) : await api.post('/internships', body);
      toast.success(id ? 'Internship updated' : 'Internship posted'); nav('/company');
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  if (loading) return <Loader />;
  return (
    <>
      <h1 className="page-title">{id ? 'Edit internship' : 'Post an internship'}</h1>
      <form className="card form wide" onSubmit={submit}>
        <label>Title<input required value={f.title} onChange={set('title')} placeholder="e.g. React Developer Intern" /></label>
        <label>Description<textarea required rows="6" value={f.description} onChange={set('description')} placeholder="What will the intern work on?" /></label>
        <div className="cols">
          <label>Category<select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Work mode<select value={f.mode} onChange={set('mode')}>{MODES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Location<input value={f.location} onChange={set('location')} /></label>
          <label>Duration<input value={f.duration} onChange={set('duration')} placeholder="3 months" /></label>
          <label>Stipend (₹ per month)<input type="number" min="0" value={f.stipend} onChange={set('stipend')} /></label>
          <label>Openings<input type="number" min="1" value={f.openings} onChange={set('openings')} /></label>
          <label>Application deadline<input type="date" value={f.deadline} onChange={set('deadline')} /></label>
          <label>Skills (comma separated)<input value={f.skills} onChange={set('skills')} placeholder="React, Node.js" /></label>
        </div>
        <div className="row"><button className="btn" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes' : 'Publish internship'}</button><button type="button" className="btn ghost" onClick={() => nav('/company')}>Cancel</button></div>
      </form>
    </>
  );
}
