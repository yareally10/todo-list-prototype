import React, { useState, useEffect } from 'react';
import type { List, ListCreate, User } from '../types';
import { listAPI, userAPI } from '../api';

const ListManager: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newList, setNewList] = useState<ListCreate>({ name: '', description: '', user_id: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLists();
    fetchUsers();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await listAPI.getAll();
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newList.user_id === 0) return;
    
    try {
      await listAPI.create(newList);
      setNewList({ name: '', description: '', user_id: 0 });
      fetchLists();
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const deleteList = async (id: number) => {
    try {
      await listAPI.delete(id);
      fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>List Management</h2>
      
      <form onSubmit={createList} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Create New List</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="List Name"
            value={newList.name}
            onChange={(e) => setNewList({ ...newList, name: e.target.value })}
            required
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newList.description}
            onChange={(e) => setNewList({ ...newList, description: e.target.value })}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <select
            value={newList.user_id}
            onChange={(e) => setNewList({ ...newList, user_id: parseInt(e.target.value) })}
            required
            style={{ padding: '8px', marginRight: '10px', width: '150px' }}
          >
            <option value={0}>Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>
            Create List
          </button>
        </div>
      </form>

      <div>
        <h3>Existing Lists</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Owner</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Created</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list) => (
                <tr key={list.id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{list.id}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{list.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{list.description || 'N/A'}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{getUserName(list.user_id)}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(list.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => deleteList(list.id)}
                      style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListManager;