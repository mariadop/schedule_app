import React, { useState } from 'react';
import API from './api';

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
}

function Login({ onLoginSuccess }: LoginProps) { // Tutaj przypisujemy interface
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // Dodajemy typ 'React.FormEvent' dla zdarzenia (e)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post('/login', { login, password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLoginSuccess(response.data.user);
    } catch (err) {
      alert("Błędny login lub hasło!");
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Logowanie do Rodzinnego Harmonogramu</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Login" onChange={e => setLogin(e.target.value)} /><br/>
        <input type="password" placeholder="Hasło" onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
}

export default Login;