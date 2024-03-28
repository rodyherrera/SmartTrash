import React from 'react';
import ReactDOM from 'react-dom/client';
import Application from '@/Application.jsx';
import { MultiProvider } from 'react-pendulum';
import { BrowserRouter } from 'react-router-dom';
import '@styles/general.css';

ReactDOM.createRoot(document.getElementById('AdminPortal-ROOT')).render(
    <MultiProvider
        providers={[
            <BrowserRouter />
        ]}
    >
        <Application />
    </MultiProvider>
);