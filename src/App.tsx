import React from 'react';
import USPollMap from './components/USPollMap';
import './App.css';

function App() {
  const handleStateClick = (stateId: string) => {
    console.log(`State clicked: ${stateId}`);
    // You can add more functionality here, like showing detailed stats
    // or opening a modal with state-specific information
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TippingPoll - How America Votes</h1>
        <p>Interactive map showing tipping preferences across the United States</p>
      </header>
      
      <main className="App-main">
        <div className="map-container">
          <USPollMap 
            onStateClick={handleStateClick}
            className="max-w-6xl mx-auto"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
