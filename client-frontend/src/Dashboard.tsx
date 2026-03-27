import React, { useEffect, useState } from 'react';
import API from './api';

// 1. Definiujemy, jak dokładnie wygląda zadanie przychodzące z bazy
interface Task {
  _id: string;
  task: string;
  day: string;
  time_frame: string;
  memberId?: {     // Dodajemy ?, bo zadanie może (teoretycznie) nie mieć przypisanej osoby
    name: string;
    color: string;
  };
}

// 2. Dashboard przyjmuje zalogowanego użytkownika jako "props"
function Dashboard({ user }: { user: any }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobieramy zadania z Twojego endpointu
    API.get('/family-status')
      .then(res => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Błąd pobierania zadań:", err);
        setLoading(false);
      });
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
              // Używamy koloru z bazy, a jeśli go brak - szary (#ccc)
              backgroundColor: t.memberId?.color || '#ccc', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
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

      {/* Przycisk akcji */}
      <button 
        onClick={() => alert("Tu otworzymy formularz dodawania zadania!")}
        style={{ 
          marginTop: '30px', 
          padding: '12px 24px', 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        + Dodaj nowe zajęcie
      </button>
    </div>
  );
}

export default Dashboard;