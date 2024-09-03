import { ChakraProvider } from '@chakra-ui/react'
import Router from './components/Router/Router'
import theme from './theme'
import { AuthProvider } from './components/Router/AuthContext'
import { KaleidoscopeProvider } from './contexts/KaleidoscopeContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {

  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider>
        <AuthProvider>
            <KaleidoscopeProvider>
              <Router />
            </KaleidoscopeProvider>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default App
