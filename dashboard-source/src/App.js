import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Insight Agent Dashboard</h1>
        <p>
          Dashboard is loading...
        </p>
      </header>
      <footer style={{ textAlign: 'center', padding: '1rem', borderTop: '1px solid #eee' }}>
        Insight Agent Dashboard © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
