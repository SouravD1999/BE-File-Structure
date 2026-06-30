import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const { token, user } = useAuth(); // 💡 Destructure user object to check role

  const config = { headers: { Authorization: token } };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users', config);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:3000/api/users/${editingId}`, { name, email }, config);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:3000/api/users', { name, email }, config);
    }
    setName(''); setEmail(''); fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user record?')) {
      await axios.delete(`http://localhost:3000/api/users/${id}`, config);
      fetchUsers();
    }
  };

  return (
    <div>
      <h2>User Management Dashboard</h2>
      
      {/* 💡 Manager-Only Form view condition */}
      {user?.role === 'Manager' && (
        <form onSubmit={handleSave} className="crud-form">
          <h3>{editingId ? 'Edit Mode: Update Details' : 'Register New User'}</h3>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit">{editingId ? 'Update User' : 'Save System Record'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); setEmail(''); }}>Cancel</button>}
        </form>
      )}

      {/* Data Table display */}
      <table className="user-table">
        <thead>
          <tr>
            <th>MongoDB ID</th>
            <th>Name</th>
            <th>Email</th>
            {/* Show Actions column header if user has at least one role permission */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td><code>{u._id}</code></td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {/* 💡 Manager-Only Edit Button */}
                {user?.role === 'Manager' && (
                  <button onClick={() => { setEditingId(u._id); setName(u.name); setEmail(u.email); }} className="edit-btn">Edit</button>
                )}

                {/* 💡 Admin-Only Delete Button */}
                {user?.role === 'Admin' && (
                  <button onClick={() => handleDelete(u._id)} className="delete-btn">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}