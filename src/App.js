// Author: Cva
import React, { useEffect, useState } from 'react';
import './styles.css';

function App(){
  const [patients,setPatients]=useState([]);
  const [doctors,setDoctors]=useState([]);
  const [selectedPatient,setSelectedPatient]=useState(null);
  const [selectedDoctor,setSelectedDoctor]=useState(null);
  const [appointmentAt,setAppointmentAt]=useState('');
  const [message,setMessage]=useState('');

  useEffect(()=>{ fetch('/api/patients').then(r=>r.json()).then(setPatients); fetch('/api/doctors').then(r=>r.json()).then(setDoctors); },[]);

  const register=async(e)=>{ e.preventDefault(); const form=e.target; const payload={name:form.name.value,email:form.email.value,phone:form.phone.value,dob:form.dob.value}; const res=await fetch('/api/patients',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); if(res.ok){ const p=await res.json(); setPatients([...patients,p]); setMessage('Patient registered'); form.reset(); } else setMessage('Register failed'); };

  const book=async()=>{ if(!selectedPatient||!selectedDoctor||!appointmentAt){ setMessage('Select patient, doctor and date/time'); return;} const payload={patient:{id:selectedPatient.id},doctor:{id:selectedDoctor.id},appointmentAt:appointmentAt}; const res=await fetch('/api/appointments/book',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); if(res.ok){ setMessage('Appointment booked'); } else { const t=await res.text(); setMessage('Booking failed: '+t); } };

  return (<div className="container"><header><h1>Patient Health Record <small>— Cva</small></h1></header>
    <section className="panel"><h2>Register Patient</h2><form onSubmit={register} className="form"><input name="name" placeholder="Full name" required/><input name="email" type="email" placeholder="Email" required/><input name="phone" placeholder="Phone"/><input name="dob" type="date"/><div className="row"><button className="primary" type="submit">Register</button></div></form>{message&&<p className="message">{message}</p>}</section>
    <section className="panel"><h2>Patients</h2><div className="list">{patients.map(p=> (<div key={p.id} className={"item "+(selectedPatient&&selectedPatient.id===p.id?'active':'')} onClick={()=>setSelectedPatient(p)}><strong>{p.name}</strong><div className="small">{p.email}</div></div>))}</div></section>
    <section className="panel"><h2>Book Appointment</h2><div className="row" style={{alignItems:'center',gap:8}}><select onChange={e=>setSelectedDoctor(doctors.find(d=>d.id==e.target.value))}><option value="">Select doctor</option>{doctors.map(d=> <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}</select><input type="datetime-local" value={appointmentAt} onChange={e=>setAppointmentAt(e.target.value)}/><button className="primary" onClick={book}>Book (Pay at Hospital)</button></div></section></div>);
}
export default App;
