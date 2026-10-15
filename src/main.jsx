import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './modules/hotel-booking/styles/tokens.css';
import './modules/hotel-booking/styles/global.css';
import './modules/hotel-booking/styles/buttons.css';
import { ensureDataVersion } from './modules/hotel-booking/lib/storage';

// One-time data migration (clears old test data, seeds the demo bookings).
// Runs before the first render so no page ever sees stale browser data.
ensureDataVersion();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
