// Continuous parameter type
export interface ContinuousParameter {
    type: "continuous";
    lower_limit_incl: number;
    upper_limit_incl: number;
    current: number;
  }
  
  // Discrete parameter level type
  export interface DiscreteParameterLevel {
    description: string;
  }
  
  // Discrete parameter type
  export interface DiscreteParameter {
    type: "discrete";
    levels: {
      [key: string]: DiscreteParameterLevel;
    };
    current_level: string;
  }
  
  // Union type for all parameter types
  export type Parameter = ContinuousParameter | DiscreteParameter;
  
  // Program type
  export interface Program {
    parameters: {
      [key: string]: Parameter;
    };
  }
  
  // Fixture type
  export interface Fixture {
    programs: {
      [key: string]: Program;
    };
    selected_program: string;
    output_aliases: string[];
  }
  
  // Root type
  export interface FixturesData {
    fixtures: {
      [key: string]: Fixture;
    };
  }