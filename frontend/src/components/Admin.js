import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchUsers();
      fetchPosts();
    }
  }, [user]);

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users');
    setUsers(res.data);
  };

  const fetchPosts = async () => {
    const res = await axios.get('/api/admin/posts');
    setPosts(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`/api/admin/users/${id}`);
    fetchUsers();
    fetchPosts();
  };

  const deletePost = async (id) => {
    await axios.delete(`/api/posts/${id}`);
    fetchPosts();
  };

  if (!user || !user.isAdmin) return <div>Access denied.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      <h3>Users</h3>
      {users.map(u => (
        <div key={u._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          {u.username} ({u.email}) {u.isAdmin && '(Admin)'}
          <button onClick={() => deleteUser(u._id)}>Delete</button>
        </div>
      ))}
      <h3>Posts</h3>
      {posts.map(p => (
        <div key={p._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h4>{p.title}</h4>
          <p>{p.content}</p>
          <button onClick={() => deletePost(p._id)}>Delete Post</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;