import React from 'react';
import App from './app';
import './scss/application.scss';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);