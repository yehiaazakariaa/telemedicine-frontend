import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const HERO_STATS = [
  { value: '500+', label: 'Expert Doctors' },
  { value: '50k+', label: 'Patients Served' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '24/7', label: 'Availability' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/doctors/meta/specializations').then(r => setSpecializations(r.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/doctors?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, #0d4a47 100%)',
        color: 'white', padding: '80px 0 100px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position:'absolute', inset:0, opacity:0.04,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container" style={{ position:'relative' }}>
          <div style={{ maxWidth:620 }}>
            <div className="badge badge-teal" style={{ marginBottom:20, fontSize:13 }}>
              🩺 Trusted Telemedicine Platform
            </div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px, 5vw, 58px)', lineHeight:1.15, marginBottom:20 }}>
              Your health, our priority.{' '}
              <span style={{ fontStyle:'italic', color:'#5eead4' }}>Anytime, anywhere.</span>
            </h1>
            <p style={{ fontSize:18, color:'#94a3b8', marginBottom:40, lineHeight:1.7 }}>
              Connect with certified doctors via video call, chat, or in-person visits. Book appointments in minutes, get care instantly.
            </p>
            <form onSubmit={handleSearch} style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <input
                type="text" placeholder="Search by doctor name or specialty..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{
                  flex:1, minWidth:240, padding:'14px 18px', borderRadius:'var(--radius-sm)',
                  border:'none', fontSize:15, outline:'none', background:'rgba(255,255,255,0.12)',
                  color:'white', backdropFilter:'blur(10px)',
                }}
                className="form-input"
              />
              <button type="submit" className="btn btn-primary" style={{ padding:'14px 28px', fontSize:15, flexShrink:0 }}>
                🔍 Search Doctors
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:'var(--teal)', padding:'28px 0' }}>
        <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {HERO_STATS.map((s,i) => (
            <div key={i} style={{ textAlign:'center', borderRight: i<3 ? '1px solid rgba(255,255,255,0.2)' : 'none', padding:'8px 0' }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:28, color:'white', lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.8)', marginTop:4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section style={{ padding:'72px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,3vw,38px)', marginBottom:12 }}>Browse by Specialty</h2>
            <p style={{ color:'var(--slate)', fontSize:16 }}>Find the right specialist for your needs</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:16 }}>
            {specializations.map(spec => (
              <button key={spec.id} onClick={() => navigate(`/doctors?specialization=${spec.id}`)}
                className="card" style={{
                  padding:'24px 16px', textAlign:'center', border:'none', cursor:'pointer',
                  transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:10
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--teal)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.transform=''; }}
              >
                <span style={{ fontSize:32 }}>{spec.icon}</span>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--navy-mid)', lineHeight:1.3 }}>{spec.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background:'var(--navy)', padding:'72px 0', color:'white' }}>
        <div className="container">
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,3vw,38px)', textAlign:'center', marginBottom:56 }}>
            How It Works
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:32 }}>
            {[
              { icon:'🔍', step:'01', title:'Find a Doctor', desc:'Search by specialty, name, or availability. Read reviews and credentials.' },
              { icon:'📅', step:'02', title:'Book a Slot', desc:'Choose a time that works for you. Instant confirmation, no waiting.' },
              { icon:'💻', step:'03', title:'Consult Online', desc:'Join a secure video call with your doctor from anywhere.' },
              { icon:'💊', step:'04', title:'Get Prescription', desc:'Receive your diagnosis, prescription, and follow-up plan digitally.' },
            ].map((item, i) => (
              <div key={i} style={{ position:'relative', paddingLeft:0 }}>
                <div style={{ fontSize:40, marginBottom:16 }}>{item.icon}</div>
                <span style={{ fontSize:12, color:'var(--teal)', fontWeight:600, letterSpacing:1 }}>{item.step}</span>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:20, margin:'8px 0' }}>{item.title}</h3>
                <p style={{ color:'#94a3b8', fontSize:14, lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 0', textAlign:'center' }}>
        <div className="container" style={{ maxWidth:560 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,3vw,38px)', marginBottom:16 }}>
            Ready to see a doctor?
          </h2>
          <p style={{ color:'var(--slate)', marginBottom:32, fontSize:16 }}>
            Join thousands of patients who manage their health with MediConnect.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => navigate('/doctors')} className="btn btn-primary" style={{ padding:'14px 32px', fontSize:16 }}>
              Find Doctors Now
            </button>
            <button onClick={() => navigate('/register')} className="btn btn-outline" style={{ padding:'14px 32px', fontSize:16 }}>
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:'var(--navy)', color:'#94a3b8', padding:'32px 0', textAlign:'center', fontSize:13 }}>
        <p>© 2026 MediConnect · Built by Yehia Zakaria for the app dev assignment</p>
      </footer>
    </div>
  );
}
