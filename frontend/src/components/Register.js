import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={onChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;