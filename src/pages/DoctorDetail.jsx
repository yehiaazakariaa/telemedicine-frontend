import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, isWeekend } from 'date-fns';
import api from '../lib/api';
import { useAuth } from '../lib/AuthContext';

function getNext14Days() {
  const days = [];
  let d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < 14) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [type, setType] = useState('video');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  const days = getNext14Days();

  useEffect(() => {
    api.get(`/doctors/${id}`).then(r => setDoctor(r.data)).catch(() => navigate('/doctors')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    api.get(`/doctors/${id}/slots?date=${format(selectedDate, 'yyyy-MM-dd')}`)
      .then(r => setSlots(r.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, id]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedDate || !selectedSlot) return;
    setBooking(true); setError('');
    try {
      await api.post('/appointments', {
        doctor_id: id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedSlot,
        type, reason
      });
      setBookingSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally { setBooking(false); }
  };

  if (loading) return <div style={{ textAlign:'center', padding:80, color:'var(--muted)' }}>Loading...</div>;
  if (!doctor) return null;

  if (bookingSuccess) return (
    <div className="container" style={{ padding:'80px 24px', textAlign:'center', maxWidth:480 }}>
      <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:32, marginBottom:12 }}>Appointment Booked!</h2>
      <p style={{ color:'var(--slate)', marginBottom:32 }}>
        Your appointment with Dr. {doctor.full_name} on {format(selectedDate, 'MMMM d, yyyy')} at {selectedSlot} has been confirmed.
      </p>
      <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">View My Appointments</button>
        <button onClick={() => navigate('/doctors')} className="btn btn-outline">Find Another Doctor</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding:'40px 24px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom:24, padding:'8px 0', fontSize:14 }}>
        ← Back
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:32, alignItems:'start' }}>
        {/* Doctor Info */}
        <div>
          <div className="card" style={{ padding:32, marginBottom:24 }}>
            <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
              <div style={{
                width:80, height:80, borderRadius:999, background:'var(--teal-light)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, flexShrink:0
              }}>
                {doctor.specialization_icon || '👨‍⚕️'}
              </div>
              <div>
                <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, marginBottom:6 }}>Dr. {doctor.full_name}</h1>
                <span className="badge badge-teal" style={{ marginBottom:12 }}>{doctor.specialization_name}</span>
                <div style={{ display:'flex', gap:16, flexWrap:'wrap', fontSize:14, color:'var(--slate)' }}>
                  <span>⭐ {doctor.rating || 0} ({doctor.review_count || 0} reviews)</span>
                  <span>🎓 {doctor.experience_years || 0} yrs experience</span>
                  <span>💰 ${doctor.consultation_fee}</span>
                </div>
              </div>
            </div>
            {doctor.bio && (
              <p style={{ marginTop:20, color:'var(--slate)', lineHeight:1.8, borderTop:'1px solid var(--border)', paddingTop:20 }}>
                {doctor.bio}
              </p>
            )}
          </div>

          {/* Availability info */}
          <div className="card" style={{ padding:24 }}>
            <h3 style={{ fontWeight:600, marginBottom:12 }}>Availability</h3>
            <p style={{ fontSize:14, color:'var(--slate)' }}>
              📅 {doctor.availability_days} &nbsp;|&nbsp; 🕐 {doctor.start_time?.slice(0,5)} – {doctor.end_time?.slice(0,5)}
            </p>
          </div>
        </div>

        {/* Booking Panel */}
        <div className="card" style={{ padding:28, position:'sticky', top:84 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, marginBottom:24 }}>Book Appointment</h2>

          {/* Type */}
          <div className="form-group" style={{ marginBottom:20 }}>
            <label className="form-label">Consultation Type</label>
            <div style={{ display:'flex', gap:8 }}>
              {['video','chat','in-person'].map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  flex:1, padding:'10px 0', borderRadius:'var(--radius-sm)', fontSize:13, fontWeight:500,
                  border: type === t ? '2px solid var(--teal)' : '1.5px solid var(--border)',
                  background: type === t ? 'var(--teal-light)' : 'white',
                  color: type === t ? 'var(--teal-dark)' : 'var(--slate)',
                  cursor:'pointer', transition:'all 0.15s', textTransform:'capitalize'
                }}>{t === 'video' ? '📹' : t === 'chat' ? '💬' : '🏥'} {t}</button>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div className="form-group" style={{ marginBottom:20 }}>
            <label className="form-label">Select Date</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
              {days.map((day, i) => {
                const isSelected = selectedDate && format(day,'yyyy-MM-dd') === format(selectedDate,'yyyy-MM-dd');
                return (
                  <button key={i} onClick={() => setSelectedDate(day)} style={{
                    padding:'8px 0', borderRadius:8, fontSize:11, border: isSelected ? '2px solid var(--teal)' : '1.5px solid var(--border)',
                    background: isSelected ? 'var(--teal)' : 'white', color: isSelected ? 'white' : 'var(--navy)',
                    cursor:'pointer', lineHeight:1.3
                  }}>
                    <div style={{ fontWeight:600 }}>{format(day,'d')}</div>
                    <div style={{ opacity:0.7 }}>{format(day,'EEE')}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div className="form-group" style={{ marginBottom:20 }}>
              <label className="form-label">Available Times</label>
              {slotsLoading ? (
                <p style={{ fontSize:13, color:'var(--muted)', padding:'8px 0' }}>Loading slots...</p>
              ) : slots.length === 0 ? (
                <p style={{ fontSize:13, color:'var(--muted)', padding:'8px 0' }}>No slots available for this day</p>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                  {slots.map(slot => (
                    <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedSlot(slot.time)} style={{
                      padding:'8px 4px', borderRadius:8, fontSize:12, fontWeight:500,
                      border: selectedSlot === slot.time ? '2px solid var(--teal)' : '1.5px solid var(--border)',
                      background: !slot.available ? 'var(--off-white)' : selectedSlot === slot.time ? 'var(--teal)' : 'white',
                      color: !slot.available ? 'var(--muted)' : selectedSlot === slot.time ? 'white' : 'var(--navy)',
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      textDecoration: !slot.available ? 'line-through' : 'none',
                    }}>{slot.time}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="form-group" style={{ marginBottom:24 }}>
            <label className="form-label">Reason (optional)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Describe your symptoms or reason for visit..."
              className="form-input" rows={3} style={{ resize:'vertical' }} />
          </div>

          {error && <p className="error-msg" style={{ marginBottom:12 }}>{error}</p>}

          <button className="btn btn-primary" style={{ width:'100%', padding:'14px 0', fontSize:16 }}
            onClick={handleBook} disabled={!selectedDate || !selectedSlot || booking}>
            {booking ? <><span className="spinner" />Booking...</> : user ? 'Confirm Booking' : 'Login to Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
