import React, { useEffect, useState } from 'react';
import API from './api';
import AddTask from './addTask'; // Upewnij się, że nazwa pliku się zgadza (AddTask czy addTask)

interface Task {
  _id: string;
  task: string;
  day: string;
  time_frame: string;
  memberId?: {
    name: string;
    color: string;
  };
}

function Dashboard({ user }: { user: any }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false); // Stan do pokazywania formularza

  // Funkcja pobierająca dane (wyciągnięta, żeby móc ją odświeżyć po dodaniu taska)
  const fetchTasks = () => {
    API.get('/family-status')
      .then(res => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Błąd pobierania zadań:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Wczytywanie planu dnia...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>🏠 Rodzinny Harmonogram</h2>
      
      {/* Siatka z kafelkami */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {tasks.length > 0 ? (
          tasks.map(t => (
            <div key={t._id} style={{ 
              backgroundColor: t.memberId?.color || '#ccc', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '5px' }}>
                {t.day.toUpperCase()} | {t.time_frame}
              </div>
              <h3 style={{ margin: '10px 0' }}>{t.task}</h3>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px', fontSize: '0.9rem' }}>
                👤 {t.memberId?.name || 'Nieprzypisane'}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#666' }}>Brak zaplanowanych zadań w kalendarzu.</p>
        )}
      </div>

      <hr style={{ margin: '40px 0', border: '0.5px solid #eee' }} />

      {/* Przycisk akcji - teraz przełącza widoczność formularza */}
      <button 
        onClick={() => setShowAddTask(!showAddTask)}
        style={{ 
          marginBottom: '20px',
          padding: '12px 24px', 
          backgroundColor: showAddTask ? '#e74c3c' : '#2c3e50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {showAddTask ? "✖ Zamknij formularz" : "+ Dodaj nowe zajęcie"}
      </button>

      {/* FORMULARZ ADD TASK - pojawia się tutaj */}
      {showAddTask && (
        <AddTask 
          user={user} 
          onTaskAdded={() => {
            setShowAddTask(false); // zamknij formularz
            fetchTasks();          // odśwież listę kafelków bez przeładowania strony!
          }} 
        />
      )}
    </div>
  );
}

export default Dashboard;