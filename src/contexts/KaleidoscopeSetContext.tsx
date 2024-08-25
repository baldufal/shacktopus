import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from '../components/Router/AuthContext';

interface KaleidoscopeSetContextType {
  setProgram: (fixture: string, program: string) => string | undefined;
  setDiscrete: (fixture: string, program: string, parameterName: string, value: string) => string | undefined;
  setContinuous: (fixture: string, program: string, parameterName: string, value: number) => string | undefined;
  error: string | undefined;
}

const KaleidoscopeSetContext = createContext<KaleidoscopeSetContextType | undefined>(undefined);

export const KaleidoscopeSetProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const setSocketRef = useRef<WebSocket | undefined>(undefined);
  const auth = useAuth();

  function setProgram(fixture: string, program: string) {
    console.log(`Setting program of fixture ${fixture} to ${program}`);
    const socket = setSocketRef.current;
    if (!socket) {
      console.log("socket undefined")
      return "No connection or no access right";
    }
    if (socket.readyState !== WebSocket.OPEN) {
      console.log("socket.readyState: " + socket.readyState)
      return "No connection or no access right";
    }
    const payload = JSON.stringify({
      action: "program",
      fixture: fixture,
      data: { programName: program }
    });
    socket.send(payload);
  }

  function setDiscrete(fixture: string, program: string, parameterName: string, value: string) {
    console.log(`Setting ${parameterName} to ${value}`);
    const socket = setSocketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return "No connection or no access right";
    }
    const payload = JSON.stringify({
      action: "discrete",
      fixture: fixture,
      data: {
        programName: program,
        parameterName: parameterName,
        value: value
      }
    });
    socket.send(payload);
  }

  function setContinuous(fixture: string, program: string, parameterName: string, value: number) {
    console.log(`Setting ${parameterName} to ${value}`);
    const socket = setSocketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return "No connection or no access right";
    }
    const payload = JSON.stringify({
      action: "continuous",
      fixture: fixture,
      data: {
        programName: program,
        parameterName: parameterName,
        value: value
      }
    });
    socket.send(payload);
  }

  const attemptReconnect = () => {
    setTimeout(() => {
      console.log(`Attempting to reconnect...`);
      establishWebSocketConnection();
    }, 1000);
  };

  const establishWebSocketConnection = () => {
    // Check if the WebSocket is already connected or connecting
    if (setSocketRef.current &&
      (setSocketRef.current.readyState === WebSocket.OPEN
        || setSocketRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket for Kaleidoscope set is already open or connecting.');
    } else {
      const socket = new WebSocket(`wss://${window.location.host}/api/kaleidoscope/set`);
      setSocketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket for Kaleidoscope set opened');
        setError(undefined);
      };

      socket.onclose = () => {
        console.log('WebSocket for Kaleidoscope set closed');
        setError("No permission to write data. Check login.");
        attemptReconnect();
      };

      socket.onerror = () => {
        console.error('WebSocket error observed:', error);
        setError("WebSocket error occurred");
        attemptReconnect();
      };
    }
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      console.log("Website became visible again")
      establishWebSocketConnection();
    }
  };

  useEffect(() => {
    establishWebSocketConnection();

    // Listen for visibility change events
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log("Cleaning up kaleidoscope set context");
      if (setSocketRef.current)
        setSocketRef.current.close();

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [auth.user]);


  return (
    <KaleidoscopeSetContext.Provider value={{ setProgram, setDiscrete, setContinuous, error }}>
      {children}
    </KaleidoscopeSetContext.Provider>
  );
};

// Create a custom hook to use the Kaleidoscope context
export const useKaleidoscopeSet = () => {
  const context = useContext(KaleidoscopeSetContext);
  if (context === undefined) {
    throw new Error('useKaleidoscopeSet must be used within a KaleidoscopeSetProvider');
  }
  return context;
};
