import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

const isDevelopment = process.env.NODE_ENV === 'development';

const RootComponent = isDevelopment ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      {RootComponent}
    </BrowserRouter>
  </>
  ,
)