import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard'// Ten komponent stworzymy za chwilę

interface User {
  id: string;
  name: string;
  role: string;
  color: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  // Sprawdzamy przy odświeżeniu strony, czy ktoś już jest zalogowany
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLoginSuccess={(userData) => setUser(userData)} />
      ) : (
        <div>
          <header style={{ background: user?.color, padding: '10px', color: 'white' }}>
            Witaj, {user?.name}! ({user?.role}) 
            <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Wyloguj</button>
          </header>
          <Dashboard user={user} />
        </div>
      )}
    </div>
  );
}

export default App;