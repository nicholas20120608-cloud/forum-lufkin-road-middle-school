import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
      <Link to="/">Forum</Link> | 
      {user ? (
        <>
          <Link to="/dms">DMs</Link> | 
          {user.isAdmin && <Link to="/admin">Admin</Link>} | 
          Welcome {user.username} | 
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | 
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;