import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { FiGrid, FiUsers, FiUpload, FiLogOut, FiUserCheck } from 'react-icons/fi';
import './MainLayout.css';

export default function MainLayout() {
  const { logout, user } = useAuth(); // 💡 Destructure the logged-in user context
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* TOP NAVIGATION NAV */}
      <header className="top-nav">
        <div className="logo">TCS Enterprise Portal</div>
        <div className="user-profile">
          <FiUserCheck style={{ marginRight: '8px' }} /> 
          {user?.email} ({user?.role}) {/* Displays logged-in role dynamically */}
        </div>
      </header>

      <div className="layout-body">
        {/* LEFT NAVIGATION NAV */}
        <aside className="left-nav">
          <nav>
            <Link to="/"><FiGrid /> Dashboard</Link>
            <Link to="/users"><FiUsers /> User Management</Link>
            
            {/* 💡 Manager-Only Menu View Condition */}
            {user?.role === 'Manager' && (
              <Link to="/upload"><FiUpload /> Media Upload</Link>
            )}
          </nav>
          <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </aside>

        {/* DYNAMIC CONTENT SCREEN AREA */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}