import { Script, ScriptAction } from "./Script";

export async function executeScript(
    script: Script,
    parameters: Record<string, any>,
    setProgram: (fixture: string, program: string) => string | undefined,
    setDiscrete: (fixture: string, program: string, parameterName: string, value: string) => string | undefined,
    setContinuous: (fixture: string, program: string, parameterName: string, value: number) => string | undefined) {
    const variables = { ...parameters };

    console.log("Starting script execution.");

    function resolveValue(value: string | number) {
        if (typeof value === "number") return value;
        if (typeof value === "string" && value.startsWith("$")) {
            const varName = value.slice(1);
            if (varName.split('.').length > 1) {
                // Handle COLOR_RGB components
                const [baseVar, component] = varName.split('.') as [string, keyof { red: number, green: number, blue: number }];
                if (!(baseVar in variables)) throw new Error(`Undefined variable: ${baseVar}`);
                return (variables[baseVar] as { red: number, green: number, blue: number })[component];
            }
            if (!(varName in variables)) throw new Error(`Undefined variable: ${varName}`);
            return variables[varName];
        }
        return value;
    }

    // Process computations
    for (const computation of script.computations) {
        if (variables[computation.name]) throw new Error(`Variable '${computation.name}' already exists.`);
        switch (computation.type) {
            case "CONSTRUCT_RGB":
                variables[computation.name] = {
                    red: resolveValue(computation.red),
                    green: resolveValue(computation.green),
                    blue: resolveValue(computation.blue)
                };
                break;
            case "CONDITION":
                variables[computation.name] = resolveValue(computation.condition)
                    ? resolveValue(computation.then)
                    : resolveValue(computation.else);
                break;
            case "CONDITION_RGB":
                variables[computation.name] = resolveValue(computation.condition) ?
                    {
                        red: resolveValue(computation.then + ".red"),
                        green: resolveValue(computation.then + ".green"),
                        blue: resolveValue(computation.then + ".blue")
                    } :
                    {
                        red: resolveValue(computation.else + ".red"),
                        green: resolveValue(computation.else + ".green"),
                        blue: resolveValue(computation.else + ".blue")
                    };
                break;
            case "LINEAR":
                variables[computation.name] = resolveValue(computation.variable) * resolveValue(computation.factor) + resolveValue(computation.offset);
                break;
            case "LINEAR_RGB":
                variables[computation.name] = {
                    red: resolveValue(computation.variable + ".red") * resolveValue(computation.factor) + resolveValue(computation.offset),
                    green: resolveValue(computation.variable + ".green") * resolveValue(computation.factor) + resolveValue(computation.offset),
                    blue: resolveValue(computation.variable + ".blue") * resolveValue(computation.factor) + resolveValue(computation.offset)
                };
                break;
        }
    }

    // Process actions
    async function executeAction(action: ScriptAction) {
        switch (action.type) {
            case "IF_THEN_ELSE":
                if (resolveValue(action.condition)) {
                    for (const subAction of action.then) await executeAction(subAction);
                } else {
                    for (const subAction of action.else) await executeAction(subAction);
                }
                break;
            case "K_SET_PROGRAM":
                setProgram(action.fixture, action.program);
                break;
            case "K_SET_CONTINUOUS":
                setContinuous(action.fixture, action.program, action.parameterName, resolveValue(action.value));
                break;
            case "K_SET_DISCRETE":
                setDiscrete(action.fixture, action.program, action.parameterName, action.value);
                break;
        }
    }



    for (const action of script.actions) {
        await executeAction(action);
    }

    console.log("Script execution complete!");
}
