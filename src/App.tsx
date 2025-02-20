import Router from './components/Router/Router'

import { AuthProvider } from './components/Router/AuthContext'
import { KaleidoscopeProvider } from './contexts/KaleidoscopeContext'
import { Provider } from './components/ui/provider'

function App() {

  return (
    <Provider>
        <AuthProvider>
            <KaleidoscopeProvider>
              <Router />
            </KaleidoscopeProvider>
        </AuthProvider>
      </Provider>
  )
}

export default App
