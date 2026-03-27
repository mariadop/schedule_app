import React, { useEffect, useState } from 'react';
import API from './api';
import AddTask from './addTask';

interface Task {
  _id: string;
  task: string;
  day: string;
  time_start: number; // Zmienione z time_frame
  time_end: number;   // Dodane
  memberId?: { _id: string; name: string; color: string; };
}

function Dashboard({ user }: { user: any }) {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [currentStatus, setCurrentStatus] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  const fetchData = async () => {
    try {
      // Pobieramy obie rzeczy na raz
      const [statusRes, nowRes] = await Promise.all([
        API.get('/family-status'),
        API.get('/family-now')
      ]);
      setAllTasks(statusRes.data);
      setCurrentStatus(nowRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Opcjonalnie: odświeżaj status "na żywo" co minutę
    const interval = setInterval(() => API.get('/family-now').then(res => setCurrentStatus(res.data)), 60000);
    return () => clearInterval(interval);
  }, []);

  // Filtrujemy zadania, aby wyciągnąć tylko te należące do zalogowanego użytkownika
  const myTasks = allTasks.filter(t => t.memberId?._id === user.id);

  if (loading) return <div style={{ padding: '20px' }}>Ładowanie harmonogramu...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#fff', backgroundColor: '#1a1c23' }}>
      
      {/* SEKCJA 1: MOJE ZAJĘCIA (NA GÓRZE) */}
      <section>
        <h2 style={{ borderBottom: `2px solid ${user.color}` }}>⭐ Moje zajęcia</h2>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
          {myTasks.length > 0 ? myTasks.map(t => (
            <div key={t._id} style={{ backgroundColor: user.color, padding: '10px', borderRadius: '8px', minWidth: '150px' }}>
              <strong>{t.task}</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
               {t.day.toUpperCase()} | {t.time_start} - {t.time_end}
              </div>
            </div>
          )) : <p>Nie masz jeszcze przypisanych zadań.</p>}
        </div>
      </section>

      {/* SEKCJA 2: CO ROBIMY TERAZ (STATUS NA ŻYWO) */}
      <section style={{ marginTop: '30px' }}>
        <h2>🏠 Co robimy teraz?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {currentStatus.length > 0 ? currentStatus.map(s => (
            <div key={s._id} style={{ borderLeft: `5px solid ${s.memberId?.color}`, padding: '10px', backgroundColor: '#2d303e' }}>
              <strong>{s.memberId?.name}</strong>: {s.task}
            </div>
          )) : <p>Nikt nie ma teraz zaplanowanych zajęć.</p>}
        </div>
      </section>

      {/* SEKCJA 3: KALENDARZ RODZINNY (WSZYSCY) */}
      <section style={{ marginTop: '30px' }}>
        <h2>📅 Kalendarz rodzinny</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {allTasks.map(t => (
            <div key={t._id} style={{ backgroundColor: t.memberId?.color || '#444', padding: '15px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
               {t.day.toUpperCase()} | {t.time_start} - {t.time_end}
              </div>
              <h3>{t.task}</h3>
              <div style={{ fontSize: '0.9rem' }}>👤 {t.memberId?.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRZYCISK DO FORMULARZA */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button 
          onClick={() => setShowAddTask(!showAddTask)}
          style={{ padding: '15px 30px', backgroundColor: '#3b4b61', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          {showAddTask ? "Zamknij formularz" : "+ Dodaj nowe zajęcie"}
        </button>
      </div>

      {showAddTask && (
        <div style={{ marginTop: '20px', backgroundColor: '#2d303e', padding: '20px', borderRadius: '15px' }}>
          <AddTask user={user} onTaskAdded={() => { setShowAddTask(false); fetchData(); }} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;