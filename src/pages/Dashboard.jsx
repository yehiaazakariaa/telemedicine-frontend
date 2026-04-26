import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import api from '../lib/api';
import { useAuth } from '../lib/AuthContext';

const STATUS_COLOR = {
  pending: { bg:'#fef9c3', color:'#854d0e' },
  confirmed: { bg:'#dcfce7', color:'#166534' },
  cancelled: { bg:'#fee2e2', color:'#991b1b' },
  completed: { bg:'#e0f2fe', color:'#075985' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/appointments/my').then(r => setAppointments(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    await api.patch(`/appointments/${id}/cancel`);
    setAppointments(prev => prev.map(a => a.id === id ? {...a, status:'cancelled'} : a));
  };

  const upcoming = appointments.filter(a => a.status !== 'cancelled' && new Date(`${a.appointment_date} ${a.appointment_time}`) > new Date());
  const past = appointments.filter(a => a.status === 'cancelled' || new Date(`${a.appointment_date} ${a.appointment_time}`) <= new Date());

  return (
    <div className="container" style={{ padding:'40px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3vw,34px)' }}>
            Hello, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color:'var(--slate)', fontSize:14 }}>Manage your medical appointments</p>
        </div>
        <Link to="/doctors" className="btn btn-primary" style={{ padding:'10px 20px', fontSize:14 }}>
          + Book New
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:80 }}>
          <div className="spinner" style={{ borderTopColor:'var(--teal)', margin:'0 auto' }} />
        </div>
      ) : appointments.length === 0 ? (
        <div className="card" style={{ padding:60, textAlign:'center' }}>
          <p style={{ fontSize:48, marginBottom:16 }}>📅</p>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, marginBottom:8 }}>No appointments yet</h3>
          <p style={{ color:'var(--slate)', marginBottom:24 }}>Book your first appointment with a doctor today</p>
          <Link to="/doctors" className="btn btn-primary">Find a Doctor</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
          {upcoming.length > 0 && (
            <section>
              <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>Upcoming Appointments</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {upcoming.map(a => <AppointmentCard key={a.id} appt={a} onCancel={handleCancel} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16, color:'var(--slate)' }}>Past & Cancelled</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {past.map(a => <AppointmentCard key={a.id} appt={a} onCancel={null} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appt, onCancel }) {
  const statusStyle = STATUS_COLOR[appt.status] || STATUS_COLOR.pending;
  const apptDate = new Date(`${appt.appointment_date} ${appt.appointment_time}`);
  const isUpcoming = apptDate > new Date() && appt.status !== 'cancelled';

  return (
    <div className="card" style={{ padding:20, display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
      <div style={{
        width:52, height:52, borderRadius:999, background:'var(--teal-light)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0
      }}>👨‍⚕️</div>

      <div style={{ flex:1, minWidth:160 }}>
        <p style={{ fontWeight:600, marginBottom:2 }}>Dr. {appt.doctor_name}</p>
        <p style={{ fontSize:13, color:'var(--slate)' }}>{appt.specialization}</p>
      </div>

      <div style={{ fontSize:14, color:'var(--slate)', minWidth:140 }}>
        <p>📅 {format(parseISO(appt.appointment_date), 'MMM d, yyyy')}</p>
        <p>🕐 {appt.appointment_time?.slice(0,5)}</p>
        <p>📹 {appt.type}</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
        <span style={{ ...statusStyle, padding:'4px 10px', borderRadius:999, fontSize:12, fontWeight:600, textTransform:'capitalize' }}>
          {appt.status}
        </span>
        {isUpcoming && appt.meeting_link && (
          <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer"
            className="btn btn-primary" style={{ padding:'6px 14px', fontSize:12 }}>
            Join Call
          </a>
        )}
        {isUpcoming && onCancel && (
          <button onClick={() => onCancel(appt.id)} className="btn btn-ghost"
            style={{ fontSize:12, padding:'6px 14px', color:'var(--error)' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
