export type Script = {
    parameters: ScriptParameter[];
    computations: ScriptComputation[];
    actions: ScriptAction[];
};
// Variable names must be at least 1 character and contain only {a-z, A-Z, _}

export const VARIABLE_NAME_REGEX = /^[a-zA-Z_]+$/;

// For NUMBER: min must be smaller than max and  min <= value <= max
// For COLOR_RGB: red, green and blue must be between 0 and 1 (inclusive)
// The three parts of COLOR_RGB can be read as NUMBER variables by specifying "$variable name.red", "$variable name.green", "$variable name.blue"
type ScriptParameter =
    | { name: string, type: "BOOLEAN"; value: boolean }
    | { name: string, type: "NUMBER"; value: number; min: number; max: number }
    | { name: string, type: "COLOR_RGB"; red: number; green: number; blue: number }

// Variables are referenced by prepending "$" to the variable name
type ScriptVariable = `$${string}`

// Variables defined in the computation block can be used later in the computation block
// No variables can be overwritten or modified in the computation block. Only new variables can be defined (with new names).
// CONDITION works on BOOLEAN (condition) and NUMBER (then, else) values and produces a new NUMBER variable
// LINEAR works only on NUMBER variables and produces a new NUMBER variable
// LINEAR_RGB only works pointwise on COLOR_RGB (variable) and NUMBER (factor, offset) and produces a new LINEAR_RGB variable
type ScriptComputation =
    | { name: string, type: "CONDITION_BOOLEAN"; condition: ScriptVariable; then: number | ScriptVariable; else: number | ScriptVariable }
    | { name: string, type: "LINEAR"; variable: ScriptVariable; factor: number | ScriptVariable; offset: number | ScriptVariable }
    | { name: string; type: "LINEAR_RGB"; variable: ScriptVariable; factor: number | ScriptVariable; offset: number | ScriptVariable }

// IF_THEN_ELSE only accepts BOOLEAN values
// K_SET_CONINUOUS only accepts NUMBER values
type ScriptAction =
    | { type: "IF_THEN_ELSE"; condition: ScriptVariable; then: ScriptAction[]; else: ScriptAction[] }
    | { type: "K_SET_PROGRAM"; fixture: string; program: string }
    | { type: "K_SET_CONTINUOUS"; fixture: string; program: string; value: number | ScriptVariable }
    | { type: "K_SET_DISCRETE"; fixture: string; program: string; value: string };


