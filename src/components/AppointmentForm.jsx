import React, { useState } from 'react';
// import './AppointmentForm.css'; // import the CSS file

const doctors = [
  { name: 'Dr. Alice', phone: '+919876543210' },
  { name: 'Dr. Bob', phone: '+919876543211' },
  { name: 'Dr. Charlie', phone: '+919876543212' },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '05:00 PM',
];

const AppointmentForm = () => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorPhone: '',
    appointmentDate: today,
    appointmentTime: '',
    symptoms: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDoctorSelect = e => {
    const doctor = doctors.find(d => d.name === e.target.value);
    setFormData({ ...formData, doctorPhone: doctor?.phone || '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      ...formData,
      appointmentDate: `${formData.appointmentDate} ${formData.appointmentTime}`,
    };

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setMessage(result.message || 'Appointment booked.');

    } catch (err) {
      setMessage('❌ Server error. Try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>📋 Book Appointment</h2>
      <form className="appointment-form" onSubmit={handleSubmit}>
        <label>👤 Patient Name</label>
        <input name="patientName" onChange={handleChange} required />

        <label>📱 Patient WhatsApp (+91...)</label>
        <input name="patientPhone" onChange={handleChange} required placeholder="+91..." />

        <label>👨‍⚕️ Choose Doctor</label>
        <select onChange={handleDoctorSelect} required>
          <option value="">-- Select --</option>
          {doctors.map(doc => (
            <option key={doc.phone} value={doc.name}>{doc.name}</option>
          ))}
        </select>

        <label>📆 Date</label>
        <input type="date" name="appointmentDate" onChange={handleChange} value={formData.appointmentDate} required />

        <label>⏰ Time</label>
        <select name="appointmentTime" onChange={handleChange} required>
          <option value="">-- Select Time --</option>
          {timeSlots.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <label>💬 Symptoms</label>
        <textarea name="symptoms" rows="3" onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Book Appointment'}
        </button>
      </form>

      {message && <div className="confirmation">{message}</div>}
    </div>
  );
};

export default AppointmentForm;
