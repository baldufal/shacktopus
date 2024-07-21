import { ChakraProvider } from '@chakra-ui/react'
import Router from './components/Router/Router'
import theme from './theme'

function App() {

  return (
    <ChakraProvider theme={theme}>
      <Router />
    </ChakraProvider>
  )
}

export default App
