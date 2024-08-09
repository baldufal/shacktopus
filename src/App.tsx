import { ChakraProvider } from '@chakra-ui/react'
import Router from './components/Router/Router'
import theme from './theme'
import { AuthProvider } from './components/Router/AuthContext'
import { KaleidoscopeUpdatesProvider } from './components/KaleidoscopePage/KaleidoscopeUpdatesContext'
import { KaleidoscopeSetProvider } from './components/KaleidoscopePage/KaleidoscopeSetContext'

function App() {

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <KaleidoscopeUpdatesProvider>
          <KaleidoscopeSetProvider>
            <Router />
          </KaleidoscopeSetProvider>
        </KaleidoscopeUpdatesProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
