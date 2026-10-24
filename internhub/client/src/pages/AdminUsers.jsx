import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { Loader, fmtDate } from '../components/UI';

export default function AdminUsers() {
  const [items, setItems] = useState(null);
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');
  const load = () => api.get('/admin/users', { params: { role, q } }).then((r) => setItems(r.data.items));
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [role, q]);

  const block = async (u) => { try { await api.put(`/admin/users/${u._id}/block`); toast.success(u.isBlocked ? 'User unblocked' : 'User blocked'); load(); } catch (e) { toast.error(errMsg(e)); } };
  const del = async (u) => {
    if (!window.confirm(`Delete ${u.name} and all their data?`)) return;
    try { await api.delete(`/admin/users/${u._id}`); toast.success('User deleted'); load(); } catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <>
      <h1 className="page-title">Manage users</h1>
      <div className="filters card two-f">
        <input placeholder="Search name, email or company" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" />
        <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role"><option value="">All roles</option><option value="student">Students</option><option value="company">Companies</option><option value="admin">Admins</option></select>
      </div>
      {!items ? <Loader /> : (
        <div className="card table-wrap"><table>
          <thead><tr><th>Name</th><th>Role</th><th>Joined</th><th>Status</th><th></th></tr></thead>
          <tbody>{items.map((u) => (
            <tr key={u._id}>
              <td><strong>{u.companyName || u.name}</strong><div className="muted small">{u.email}</div></td>
              <td>{u.role}</td><td>{fmtDate(u.createdAt)}</td>
              <td><span className={`badge ${u.isBlocked ? 's-rejected' : 's-approved'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
              <td className="actions">{u.role !== 'admin' && <><button className="btn ghost sm" onClick={() => block(u)}>{u.isBlocked ? 'Unblock' : 'Block'}</button><button className="btn danger sm" onClick={() => del(u)}>Delete</button></>}</td>
            </tr>))}</tbody></table></div>
      )}
    </>
  );
}
