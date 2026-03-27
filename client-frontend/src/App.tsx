import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard'// Ten komponent stworzymy za chwilę
import Register from './Register'; // Komponent do rejestracji nowych członków rodziny

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

  // return (
  //   <div className="App">
  //     {!user ? (
  //       <Login onLoginSuccess={(userData) => setUser(userData)} />
  //     ) : (
  //       <div>
  //         <header style={{ background: user?.color, padding: '10px', color: 'white' }}>
  //           Witaj, {user?.name}! ({user?.role}) 
  //           <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Wyloguj</button>
  //         </header>
  //         <Dashboard user={user} />
  //       </div>
  //     )}
  //   </div>
  // );

  const [view, setView] = useState<'login' | 'register'>('login'); // Nowy stan

  // ... useEffect bez zmian ...

  if (!user) {
    return view === 'login' ? (
      <div>
        <Login onLoginSuccess={(userData: User) => setUser(userData)} />
        <p style={{ textAlign: 'center' }}>
          Nie masz konta? <button onClick={() => setView('register')}>Zarejestruj członka rodziny</button>
        </p>
      </div>
    ) : (
      <Register onBack={() => setView('login')} />
    );
  }

  return (
    <div className="App">
       <header style={{ background: user?.color, padding: '10px', color: 'white' }}>
         Witaj, {user?.name}! <button onClick={handleLogout}>Wyloguj</button>
       </header>
       <Dashboard user={user} />
    </div>
  );

}

export default App;