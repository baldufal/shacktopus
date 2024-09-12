import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../components/Router/AuthContext';
import { FixturesData } from '../components/KaleidoscopePage/kaleidoscopeTypes';
import { ALIASES } from '../components/KaleidoscopePage/aliases';
import useWebSocket, { ReadyState } from 'react-use-websocket';


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

  const auth = useAuth();
  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/api/kaleidoscope`);

  useEffect(() => {
    if (readyState === ReadyState.OPEN || readyState === ReadyState.CONNECTING) {
        setError(undefined);
    } else {
        setError("WebSocket for Kaleidoscope: state != OPEN or CONNECTING");
    }
}, [readyState]);

  function setProgram(fixture: string, program: string) {
    console.log(`Setting program of fixture ${fixture} to ${program}`);
    if (readyState !== WebSocket.OPEN) {
      console.log("socket.readyState: " + readyState)
      return "No connection or no access right";
    }
    const payload = JSON.stringify({
      token: auth.token,
      action: "program",
      fixture: fixture,
      data: { programName: program }
    });
    sendMessage(payload)
  }

  function setDiscrete(fixture: string, program: string, parameterName: string, value: string) {
    console.log(`Setting ${parameterName} to ${value}`);
    if (readyState !== WebSocket.OPEN) {
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
    sendMessage(payload)
  }

  function setContinuous(fixture: string, program: string, parameterName: string, value: number) {
    console.log(`Setting ${parameterName} to ${value}`);
    if (readyState !== WebSocket.OPEN) {
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
    sendMessage(payload)
  }

  useEffect(() => {
    if (lastMessage !== null) {
      const parsedMessage = JSON.parse(lastMessage.data);
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
    }
}, [lastMessage]);


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