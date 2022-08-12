import React from 'react';
import './App.css';
import { useMqttClient } from './helpers';
import logo from './logo.svg';

function App() {
  const mqttClient = useMqttClient({
    brokerUrl: '192.168.1.2',
    clientId: 'dk25-web',
    auth: {
      username: 'dk25',
      password: 'dk25Pass',
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
