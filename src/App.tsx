import { ChakraProvider } from '@chakra-ui/react'
import Router from './components/Router/Router'
import theme from './theme'
import { AuthProvider } from './components/Router/AuthContext'
import { KaleidoscopeProvider } from './components/KaleidoscopePage/KaleidoscopeContext'

function App() {

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <KaleidoscopeProvider>
          <Router />
        </KaleidoscopeProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
