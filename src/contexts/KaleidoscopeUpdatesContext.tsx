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

  useEffect(() => {
    if (!auth.token) {
      setError("Not logged in!");
      return;
    }
    const updateSocket = new WebSocket(`wss://${window.location.host}/api/kaleidoscope/updates?token=${auth.token}`);
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
  }, [auth.token, fixtureNames]);

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
