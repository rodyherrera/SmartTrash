import React from 'react';
import ReactDOM from 'react-dom/client';
import Application from '@/Application.jsx';
import { MultiProvider } from 'react-pendulum';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxStore from '@utilities/store';
import '@styles/general.css';

ReactDOM.createRoot(document.getElementById('AdminPortal-ROOT')).render(
    <MultiProvider
        providers={[
            <Provider store={reduxStore} />,
            <BrowserRouter />
        ]}
    >
        <Application />
    </MultiProvider>
);