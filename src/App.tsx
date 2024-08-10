import { ChakraProvider } from '@chakra-ui/react'
import Router from './components/Router/Router'
import theme from './theme'
import { AuthProvider } from './components/Router/AuthContext'
import { KaleidoscopeSetProvider } from './contexts/KaleidoscopeSetContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { KaleidoscopeUpdatesProvider } from './contexts/KaleidoscopeUpdatesContext'

function App() {

  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider>
        <AuthProvider>
          <KaleidoscopeUpdatesProvider>
            <KaleidoscopeSetProvider>
              <Router />
            </KaleidoscopeSetProvider>
          </KaleidoscopeUpdatesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default App
