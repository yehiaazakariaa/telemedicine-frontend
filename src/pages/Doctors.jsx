import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import DoctorCard from '../components/DoctorCard';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const specialization = searchParams.get('specialization') || '';

  useEffect(() => {
    api.get('/doctors/meta/specializations').then(r => setSpecializations(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (specialization) params.set('specialization', specialization);
    api.get(`/doctors?${params}`).then(r => {
      setDoctors(r.data.doctors || []);
    }).catch(() => setDoctors([])).finally(() => setLoading(false));
  }, [search, specialization]);

  const setFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="container" style={{ padding:'40px 24px' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(24px,3vw,36px)', marginBottom:8 }}>Find a Doctor</h1>
      <p style={{ color:'var(--slate)', marginBottom:32 }}>Browse our network of certified specialists</p>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:32, flexWrap:'wrap' }}>
        <input
          type="text" placeholder="Search doctors..." value={search}
          onChange={e => setFilter('search', e.target.value)}
          className="form-input" style={{ flex:'1 1 220px', maxWidth:320 }}
        />
        <select value={specialization} onChange={e => setFilter('specialization', e.target.value)}
          className="form-input" style={{ flex:'0 1 220px' }}>
          <option value="">All Specialties</option>
          {specializations.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--muted)' }}>
          <div className="spinner" style={{ borderTopColor:'var(--teal)', margin:'0 auto 16px' }} />
          Loading doctors...
        </div>
      ) : doctors.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--muted)' }}>
          <p style={{ fontSize:40, marginBottom:12 }}>🔍</p>
          <p style={{ fontSize:18, fontWeight:500 }}>No doctors found</p>
          <p style={{ fontSize:14 }}>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:24 }}>
          {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      )}
    </div>
  );
}
