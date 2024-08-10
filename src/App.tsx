import { ChakraProvider } from '@chakra-ui/react'
import Router from './components/Router/Router'
import theme from './theme'
import { AuthProvider } from './components/Router/AuthContext'
import { KaleidoscopeUpdatesProvider } from './components/KaleidoscopePage/KaleidoscopeUpdatesContext'
import { KaleidoscopeSetProvider } from './components/KaleidoscopePage/KaleidoscopeSetContext'
import { ThemeProvider } from './ThemeContext'

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
