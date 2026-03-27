import React, { useState } from 'react';
import API from './api';

function Register({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    login: '',
    password: '',
    color: '#3498db'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/register', formData);
      alert("Dodano nowego członka rodziny!");
      onBack(); // wracamy do logowania
    } catch (err) {
      alert("Błąd rejestracji. Może login jest zajęty?");
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Dodaj Członka Rodziny 👤</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <input type="text" placeholder="Imię" required onChange={e => setFormData({...formData, name: e.target.value})} /><br/>
        <input type="text" placeholder="Rola (np. Mama)" required onChange={e => setFormData({...formData, role: e.target.value})} /><br/>
        <input type="text" placeholder="Login" required onChange={e => setFormData({...formData, login: e.target.value})} /><br/>
        <input type="password" placeholder="Hasło" required onChange={e => setFormData({...formData, password: e.target.value})} /><br/>
        <label>Kolor w kalendarzu:</label><br/>
        <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} /><br/><br/>
        <button type="submit">Zarejestruj</button>
        <button type="button" onClick={onBack} style={{ marginLeft: '10px' }}>Anuluj</button>
      </form>
    </div>
  );
}

export default Register;