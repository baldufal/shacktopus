import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import theme from './theme.ts'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ColorModeScript } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </>
  ,
)
