import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import InternshipCard from '../components/InternshipCard';
import { Loader, Empty } from '../components/UI';

export default function Saved() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get('/saved').then((r) => setItems(r.data.items)); }, []);
  const remove = async (id) => {
    try { await api.delete(`/saved/${id}`); setItems(items.filter((i) => i._id !== id)); toast('Removed from saved'); } catch (e) { toast.error(errMsg(e)); }
  };
  if (!items) return <Loader />;
  return (
    <>
      <h1 className="page-title">Saved internships</h1>
      {items.length === 0 ? <Empty title="No saved internships" text="Tap the star on any internship to keep it here." to="/internships" cta="Browse internships" />
        : <div className="grid">{items.map((i) => <InternshipCard key={i._id} item={i} saved onToggleSave={remove} />)}</div>}
    </>
  );
}
