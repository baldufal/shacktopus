import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ALIASES } from '../components/KaleidoscopePage/aliases';
import { FixturesData } from '../components/KaleidoscopePage/kaleidoscopeTypes';
import { useAuth } from '../components/Router/AuthContext';

export interface FixtureName{
  original: string,
  display: string
}

interface KaleidoscopeUpdatesContextType {
  fixturesData: FixturesData | null;
  fixtureNames: FixtureName[] | null;
  error: string | undefined;
}

const KaleidoscopeUpdatesContext = createContext<KaleidoscopeUpdatesContextType | undefined>(undefined);

export const KaleidoscopeUpdatesProvider = ({ children }: { children: ReactNode }) => {
  const [fixturesData, setFixturesData] = useState<FixturesData | null>(null);
  const [fixtureNames, setFixtureNames] = useState<FixtureName[] | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const updateSocketRef = useRef<WebSocket | undefined>(undefined);
  const auth = useAuth();

  const attemptReconnect = () => {
    setTimeout(() => {
      console.log(`Attempting to reconnect...`);
      establishWebSocketConnection();
    }, 1000);
  };

  const establishWebSocketConnection = () => {
    // Check if the WebSocket is already connected or connecting
    if (updateSocketRef.current &&
      (updateSocketRef.current.readyState === WebSocket.OPEN
        || updateSocketRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket for Kaleidoscope set is already open or connecting.');
    } else {
      const socket = new WebSocket(`wss://${window.location.host}/api/kaleidoscope/set`);
      updateSocketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket for Kaleidoscope set opened');
        setError(undefined);
      };

      socket.onmessage = (message: MessageEvent) => {
        const parsedMessage = JSON.parse(message.data);
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
        console.log('WebSocket for Kaleidoscope updates closed');
        setError("No permission to read data. Check login.");
        attemptReconnect();
      };

      socket.onerror = () => {
        console.error('WebSocket error observed:', error);
        setError("WebSocket error occurred");
        attemptReconnect();
      };
    }
  }

  useEffect(() => {
    const updateSocket = new WebSocket(`wss://${window.location.host}/api/kaleidoscope/updates`);
    updateSocketRef.current = updateSocket;

    updateSocket.onopen = () => {
      console.log('WebSocket for Kaleidoscope updates opened');
      setError(undefined);
    };

    updateSocket.onmessage = (message: MessageEvent) => {
      const parsedMessage = JSON.parse(message.data);
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

    updateSocket.onclose = () => {
      console.log('WebSocket for Kaleidoscope updates closed');
      setError("No permission to read data. Check login.");
    };

    return () => {
      if (updateSocketRef.current)
        updateSocketRef.current.close();
    };
  }, [auth.user, fixtureNames]);

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
      console.log("Cleaning up kaleidoscope update context");
      if (updateSocketRef.current)
        updateSocketRef.current.close();

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [auth.user]);


  return (
    <KaleidoscopeUpdatesContext.Provider value={{ fixturesData, fixtureNames, error }}>
      {children}
    </KaleidoscopeUpdatesContext.Provider>
  );
};

// Create a custom hook to use the Kaleidoscope context
export const useKaleidoscopeUpdates = () => {
  const context = useContext(KaleidoscopeUpdatesContext);
  if (context === undefined) {
    throw new Error('useKaleidoscope must be used within a KaleidoscopeProvider');
  }
  return context;
};
