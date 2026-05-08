import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';

import {Toaster} from 'react-hot-toast'
import { StudyProvider } from './context/StudyContext.jsx';
import { QuizProvider } from './context/QuizContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <QuizProvider>
  <AuthProvider>
    <StudyProvider >
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <App/>
    </StudyProvider >

  </AuthProvider>
  </QuizProvider>
  </StrictMode>,
)
