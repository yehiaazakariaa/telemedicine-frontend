import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: 'white', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:26, }}>⚕️</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:22, color:'var(--teal)' }}>MediConnect</span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Link to="/doctors" className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:14 }}>
            Find Doctors
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:14 }}>
                My Appointments
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding:'8px 16px', fontSize:14 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:14 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding:'8px 16px', fontSize:14 }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
