import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../../../src/index.css'; // Import global styles if needed, though we have inline tailwind config in index.html for specific theme

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
