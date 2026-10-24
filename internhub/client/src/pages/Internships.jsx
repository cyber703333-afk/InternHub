import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, MODES } from '../config';
import InternshipCard from '../components/InternshipCard';
import { Loader, Empty, Pager } from '../components/UI';

export default function Internships() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: '', category: '', mode: '', location: '', minStipend: '', sort: 'new' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [saved, setSaved] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries({ ...filters, page }).filter(([, v]) => v !== ''));
    api.get('/internships', { params }).then((r) => setData(r.data)).catch((e) => toast.error(errMsg(e))).finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  useEffect(() => { if (user?.role === 'student') api.get('/saved').then((r) => setSaved(new Set(r.data.items.map((i) => i._id)))).catch(() => {}); }, [user]);

  const toggleSave = async (id) => {
    try {
      if (saved.has(id)) { await api.delete(`/saved/${id}`); saved.delete(id); toast('Removed from saved'); }
      else { await api.post(`/saved/${id}`); saved.add(id); toast.success('Saved'); }
      setSaved(new Set(saved));
    } catch (e) { toast.error(errMsg(e)); }
  };
  const set = (k) => (e) => { setPage(1); setFilters({ ...filters, [k]: e.target.value }); };

  return (
    <>
      <h1 className="page-title">Browse internships</h1>
      <div className="filters card">
        <input placeholder="Search title or skill" value={filters.q} onChange={set('q')} aria-label="Search" />
        <select value={filters.category} onChange={set('category')} aria-label="Category"><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={filters.mode} onChange={set('mode')} aria-label="Work mode"><option value="">Any mode</option>{MODES.map((c) => <option key={c}>{c}</option>)}</select>
        <input placeholder="Location" value={filters.location} onChange={set('location')} aria-label="Location" />
        <input type="number" min="0" placeholder="Min stipend ₹" value={filters.minStipend} onChange={set('minStipend')} aria-label="Minimum stipend" />
        <select value={filters.sort} onChange={set('sort')} aria-label="Sort"><option value="new">Newest first</option><option value="stipend">Highest stipend</option></select>
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <Empty title="No internships match" text="Try removing a filter or searching a different skill." /> : (
        <>
          <p className="muted small">{data.total} internship{data.total === 1 ? '' : 's'} found</p>
          <div className="grid">{data.items.map((i) => <InternshipCard key={i._id} item={i} saved={saved.has(i._id)} onToggleSave={user?.role === 'student' ? toggleSave : null} />)}</div>
          <Pager page={page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
}
