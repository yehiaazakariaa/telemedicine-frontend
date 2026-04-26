import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  const stars = Math.round(doctor.rating || 0);
  return (
    <div className="card fade-up" style={{ padding:24, display:'flex', flexDirection:'column', gap:16, transition:'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
    >
      <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
        <div style={{
          width:56, height:56, borderRadius:999, background:'var(--teal-light)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:26, flexShrink:0
        }}>
          {doctor.avatar_url ? <img src={doctor.avatar_url} alt="" style={{ width:'100%', height:'100%', borderRadius:999, objectFit:'cover' }} />
            : doctor.specialization_icon || '👨‍⚕️'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, lineHeight:1.3, marginBottom:4 }}>
            Dr. {doctor.full_name}
          </h3>
          <span className="badge badge-teal">{doctor.specialization_name}</span>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color:'#f59e0b', fontSize:14 }}>{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</span>
          <span style={{ fontSize:13, color:'var(--muted)' }}>({doctor.review_count || 0} reviews)</span>
        </div>
        <p style={{ fontSize:13, color:'var(--slate)' }}>{doctor.experience_years || 0}+ years experience</p>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--border)' }}>
        <div>
          <span style={{ fontSize:13, color:'var(--muted)' }}>Consultation fee</span>
          <p style={{ fontWeight:600, color:'var(--teal)' }}>${doctor.consultation_fee || 'Free'}</p>
        </div>
        <Link to={`/doctors/${doctor.id}`} className="btn btn-primary" style={{ padding:'8px 18px', fontSize:14 }}>
          Book Now
        </Link>
      </div>
    </div>
  );
}
