import React, { useState } from 'react';
import API from './api';

function AddTask({ user, onTaskAdded }: { user: any, onTaskAdded: () => void }) {
  const [taskData, setTaskData] = useState({
    memberId: user.id, // Przypisujemy zadanie do zalogowanego usera
    day: 'poniedziałek',
    time_start: 1000,
    time_end: 1100,
    task: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/schedule', taskData);
      alert("Zadanie dodane!");
      onTaskAdded(); // Odświeżamy listę w Dashboardzie
    } catch (err) {
      alert("Błąd podczas dodawania zadania.");
    }
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
      <h3>Dodaj nowe zajęcie ✍️</h3>
      <form onSubmit={handleSubmit}>
        <select onChange={e => setTaskData({...taskData, day: e.target.value})}>
          <option value="poniedziałek">Poniedziałek</option>
          <option value="wtorek">Wtorek</option>
          <option value="środa">Środa</option>
          <option value="czwartek">Czwartek</option>
          <option value="piątek">Piątek</option>
          <option value="sobota">Sobota</option>
          <option value="niedziela">Niedziela</option>
        </select>
        <input type="number" placeholder="Start (np. 1400)" onChange={e => setTaskData({...taskData, time_start: parseInt(e.target.value)})} />
        <input type="number" placeholder="Koniec (np. 1530)" onChange={e => setTaskData({...taskData, time_end: parseInt(e.target.value)})} />
        <input type="text" placeholder="Co będziesz robić?" required onChange={e => setTaskData({...taskData, task: e.target.value})} />
        <button type="submit">Zapisz w kalendarzu</button>
      </form>
    </div>
  );
}

export default AddTask;