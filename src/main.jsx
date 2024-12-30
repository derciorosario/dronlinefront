import React from 'react'
import "core-js/stable";
import "regenerator-runtime/runtime";

import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext.jsx';

import { HomeDataProvider } from './landingpage/contexts/DataContext.jsx';
import { HomeAuthProvider } from './landingpage/contexts/AuthContext.jsx';


import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <GoogleOAuthProvider clientId="344779464047-n0amoat05o993dpkjpfov5245p8dt7d3.apps.googleusercontent.com">
      <DataProvider>
        <Toaster/>
          <HomeAuthProvider>
            <HomeDataProvider>
                <App />
            </HomeDataProvider>
          </HomeAuthProvider>
      </DataProvider>
    </GoogleOAuthProvider>
  </AuthProvider>,
)
