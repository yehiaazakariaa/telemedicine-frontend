import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="card fade-up" style={{ width:'100%', maxWidth:420, padding:40 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <span style={{ fontSize:40 }}>⚕️</span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, marginTop:8 }}>Welcome back</h1>
          <p style={{ color:'var(--slate)', fontSize:14 }}>Sign in to your MediConnect account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" required placeholder="you@email.com" className="form-input"
              value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required placeholder="••••••••" className="form-input"
              value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ padding:'13px 0', fontSize:15, width:'100%' }} disabled={loading}>
            {loading ? <><span className="spinner" />Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--slate)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'var(--teal)', fontWeight:500 }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}
