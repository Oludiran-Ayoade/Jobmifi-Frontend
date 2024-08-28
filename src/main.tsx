import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../src/context/useAuth.tsx'
import Header from "../src/components/Header.tsx"
import Footer from './components/Footer.tsx'
import { ApplicationStatusProvider } from '../src/context/statusContext.tsx';
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <ApplicationStatusProvider>
    <BrowserRouter>
    <Header />
    <App />
    <Footer />
    </BrowserRouter>
    </ApplicationStatusProvider>
    </AuthProvider>
  </React.StrictMode>,
)
