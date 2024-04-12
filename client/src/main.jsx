import React from 'react';
import ReactDOM from 'react-dom/client';
import Application from '@/Application.jsx';
import reduxStore from '@utilities/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MultiProvider } from 'react-pendulum';
import '@styles/general.css';

ReactDOM.createRoot(document.getElementById('SmartTrash-ROOT')).render(
    <MultiProvider
        providers={[
            <Provider store={reduxStore} />,
            <BrowserRouter />
        ]}
    >
        <Application />
    </MultiProvider>
);