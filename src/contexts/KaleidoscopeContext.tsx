import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from '../components/Router/AuthContext';
import { FixturesData } from '../components/KaleidoscopePage/kaleidoscopeTypes';
import { ALIASES } from '../components/KaleidoscopePage/aliases';


export interface FixtureName {
  original: string,
  display: string
}

interface KaleidoscopeContextType {
  fixturesData: FixturesData | null;
  fixtureNames: FixtureName[] | null;
  //
  setProgram: (fixture: string, program: string) => string | undefined;
  setDiscrete: (fixture: string, program: string, parameterName: string, value: string) => string | undefined;
  setContinuous: (fixture: string, program: string, parameterName: string, value: number) => string | undefined;
  //
  error: string | undefined;
}

const KaleidoscopeContext = createContext<KaleidoscopeContextType | undefined>(undefined);

export const KaleidoscopeProvider = ({ children }: { children: ReactNode }) => {
  const [fixturesData, setFixturesData] = useState<FixturesData | null>(null);
  const [fixtureNames, setFixtureNames] = useState<FixtureName[] | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const socketRef = useRef<WebSocket | undefined>(undefined);
  const auth = useAuth();

  function setProgram(fixture: string, program: string) {
    console.log(`Setting program of fixture ${fixture} to ${program}`);
    const socket = socketRef.current;
    if (!socket) {
      console.log("socket undefined")
      return "No connection or no access right";
    }
    if (socket.readyState !== WebSocket.OPEN) {
      console.log("socket.readyState: " + socket.readyState)
      return "No connection or no access right";
    }
    const payload = JSON.stringify({
      token: auth.token,
      action: "program",
      fixture: fixture,
      data: { programName: program }
    });
    socket.send(payload);
  }

  function setDiscrete(fixture: string, program: string, parameterName: string, value: string) {
    console.log(`Setting ${parameterName} to ${value}`);
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return "No connection or no access right";
    }
    const payload = JSON.stringify({
      token: auth.token,
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
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return "No connection or no access right";
    }
    const payload = JSON.stringify({
      token: auth.token,
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
      establishWebSocketConnection();
    }, 1000);
  };

  const establishWebSocketConnection = () => {
    // Check if the WebSocket is already connected or connecting
    if (socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN
        || socketRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket for Kaleidoscope is already open or connecting.');
    } else {
      const socket = new WebSocket(`ws://${window.location.host}/api/kaleidoscope`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket for Kaleidoscope opened');
        setError(undefined);
      };

      socket.onmessage = (message: MessageEvent) => {
        const parsedMessage = JSON.parse(message.data);
        if (parsedMessage.messageType === "update")
          if (parsedMessage.health === "good") {
            setError(undefined);
            setFixturesData(parsedMessage.data as FixturesData);
            if (!fixtureNames) {
              const extractedNames = Object.keys(parsedMessage.data.fixtures).sort();
              setFixtureNames(
                extractedNames.map(name => {
                  return {
                    original: name,
                    display: ALIASES[name] || name
                  };
                })
              );
            }
          } else {
            console.log("Received kaleidoscope update with health != good");
          }
      };

      socket.onclose = () => {
        console.log('WebSocket for Kaleidoscope closed');
        setError("WebSocket closed.");
        attemptReconnect();
      };

      socket.onerror = () => {
        console.error('Kaleidoscope WebSocket error observed:', error);
        setError("WebSocket error occurred.");
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

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log("Cleaning up kaleidoscope context");
      if (socketRef.current)
        socketRef.current.close();

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [auth.user]);

  return (
    <KaleidoscopeContext.Provider value={{ fixtureNames, fixturesData, setProgram, setDiscrete, setContinuous, error }}>
      {children}
    </KaleidoscopeContext.Provider>
  );
};


export const useKaleidoscope = () => {
  const context = useContext(KaleidoscopeContext);
  if (context === undefined) {
    throw new Error('useKaleidoscope must be used within a KaleidoscopeProvider');
  }
  return context;
};
