import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
   
    <DataProvider>
       <Toaster/>
       <App />
    </DataProvider>
  </AuthProvider>,
)
