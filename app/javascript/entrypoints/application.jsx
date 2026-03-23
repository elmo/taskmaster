import React from 'react';
import { createRoot } from 'react-dom/client';
// 1. Point this to the new location
import App from '../components/graphql/App.jsx'; 

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
