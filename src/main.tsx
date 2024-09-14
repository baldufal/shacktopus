import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import theme from './theme.ts'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ColorModeScript } from '@chakra-ui/react'

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
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <BrowserRouter>
      {RootComponent}
    </BrowserRouter>
  </>
  ,
)