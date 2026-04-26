import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name:'', email:'', password:'', phone:'', gender:'', date_of_birth:'' });
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({...f, [key]: val}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    const result = await register(form);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="card fade-up" style={{ width:'100%', maxWidth:460, padding:40 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <span style={{ fontSize:40 }}>🩺</span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, marginTop:8 }}>Create your account</h1>
          <p style={{ color:'var(--slate)', fontSize:14 }}>Start managing your health today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input type="text" required placeholder="Ahmed Hassan" className="form-input"
              value={form.full_name} onChange={e => set('full_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input type="email" required placeholder="ahmed@email.com" className="form-input"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" required placeholder="Min 8 characters" className="form-input"
              value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" placeholder="+20 10..." className="form-input"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-input" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ padding:'13px 0', fontSize:15, width:'100%' }} disabled={loading}>
            {loading ? <><span className="spinner" />Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--slate)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--teal)', fontWeight:500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
