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
    if (!socket || socket.readyState !== WebSocket.OPEN) {
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

  useEffect(() => {
    if (!auth.token) {
      setError("Not logged in!");
      return;
    }

    const setSocket = new WebSocket(`wss://${window.location.host}/api/kaleidoscope/set?token=${auth.token}`);
    setSocketRef.current = setSocket;

    setSocket.onopen = () => {
      console.log('WebSocket for Kaleidoscope set opened');
      setError(undefined);
    };

    setSocket.onmessage = (message: MessageEvent) => {
      console.log("Received kaleidoscope set message: " + message.data);
    };

    setSocket.onerror = (error) => {
      console.error('WebSocket error observed:', error);
      setError("WebSocket error occurred");
    };

    setSocket.onclose = () => {
      console.log('WebSocket for Kaleidoscope set closed');
      setError("No permission to write data. Check login.");
      setSocketRef.current = undefined;
    };

    return () => {
      if (setSocketRef.current) {
        setSocketRef.current.close();
      }
    };
  }, [auth.token]);

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
