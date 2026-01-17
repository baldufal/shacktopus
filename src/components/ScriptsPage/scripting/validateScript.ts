import { Script, VARIABLE_NAME_REGEX } from "./Script";

type ValidationResult = { valid: true; script: Script } | { valid: false; error: string };

type VariableType = "BOOLEAN" | "NUMBER" | "COLOR_RGB";

/**
 * Validates a script JSON string and checks for correct variable usage.
 */
export function validateScript(jsonString: string): ValidationResult {
    try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== "object") {
            return { valid: false, error: "Invalid script structure: Expected a JSON object." };
        }

        const { parameters, computations, actions } = parsed;
        if (!Array.isArray(parameters) || !Array.isArray(computations) || !Array.isArray(actions)) {
            return { valid: false, error: "Script must have 'parameters', 'computations', and 'actions' as arrays." };
        }

        const variableTypes = new Map<string, VariableType>();

        // Validate parameters and store variable types
        for (const param of parameters) {
            const paramError = validateParameter(param);
            if (paramError) return { valid: false, error: paramError };
            if (variableTypes.has(param.name)) {
                return { valid: false, error: `Duplicate parameter variable: '${param.name}'.` };
            }
            variableTypes.set(param.name, param.type);
            if (param.type === "COLOR_RGB") {
                variableTypes.set(`${param.name}.red`, "NUMBER");
                variableTypes.set(`${param.name}.green`, "NUMBER");
                variableTypes.set(`${param.name}.blue`, "NUMBER");
            }
        }

        // Validate computations and ensure correct variable types
        for (const computation of computations) {
            const computationError = validateComputation(computation, variableTypes);
            if (computationError) return { valid: false, error: computationError };
            variableTypes.set(computation.name,
                (computation.type === "LINEAR_RGB"
                    || computation.type === "CONDITION_RGB"
                    || computation.type === "CONSTRUCT_RGB") ?
                    "COLOR_RGB" : "NUMBER");
            if (computation.type === "LINEAR_RGB"
                || computation.type === "CONDITION_RGB"
                || computation.type === "CONSTRUCT_RGB") {
                variableTypes.set(`${computation.name}.red`, "NUMBER");
                variableTypes.set(`${computation.name}.green`, "NUMBER");
                variableTypes.set(`${computation.name}.blue`, "NUMBER");
            }
        }

        // Validate actions and check for correct variable usage
        for (const action of actions) {
            const actionError = validateAction(action, variableTypes);
            if (actionError) return { valid: false, error: actionError };
        }
        //console.log("Variable types: ", variableTypes);
        return { valid: true, script: parsed as Script };
    } catch (error) {
        return { valid: false, error: "Invalid JSON format: " + (error as Error).message };
    }
}

/**
 * Validates a script parameter.
 */
function validateParameter(param: any): string | null {
    if (!param || typeof param !== "object" || typeof param.name !== "string") {
        return "Invalid parameter structure.";
    }

    if (!VARIABLE_NAME_REGEX.test(param.name)) {
        return `Invalid parameter name: '${param.name}'.`;
    }

    switch (param.type) {
        case "COMMENT":
            return null;
            
        case "BOOLEAN":
            return typeof param.value === "boolean" ? null : `BOOLEAN parameter '${param.name}' must be true or false.`;

        case "NUMBER":
            if (
                typeof param.value !== "number" || typeof param.min !== "number" || typeof param.max !== "number" ||
                param.min >= param.max || param.value < param.min || param.value > param.max
            ) {
                return `NUMBER parameter '${param.name}' must satisfy min < max and min ≤ value ≤ max.`;
            }
            return null;

        case "COLOR_RGB":
            if (![param.red, param.green, param.blue].every(n => typeof n === "number" && n >= 0 && n <= 1)) {
                return `COLOR_RGB parameter '${param.name}' must have red, green, blue in [0, 1].`;
            }
            return null;

        default:
            return `Unknown parameter type: '${param.type}'.`;
    }
}

/**
 * Validates a script computation and checks variable types.
 */
function validateComputation(computation: any, variableTypes: Map<string, VariableType>): string | null {
    if (!computation || typeof computation !== "object" || typeof computation.name !== "string") {
        return "Invalid computation structure.";
    }

    if (!VARIABLE_NAME_REGEX.test(computation.name) || variableTypes.has(computation.name)) {
        return `Invalid or duplicate computation variable: '${computation.name}'.`;
    }

    function isValidVarOrNumber(value: any, expectedType: VariableType): boolean {
        if (typeof value === "number") return expectedType === "NUMBER";
        if (typeof value === "string" && value.startsWith("$")) {
            return variableTypes.get(value.slice(1)) === expectedType;
        }
        return false;
    }

    switch (computation.type) {
        case "CONSTRUCT_RGB":
            if (!isValidVarOrNumber(computation.red, "NUMBER")) return `Invalid red value '${computation.red}'. Expected NUMBER.`;
            if (!isValidVarOrNumber(computation.green, "NUMBER")) return `Invalid green value '${computation.green}'. Expected NUMBER.`;
            if (!isValidVarOrNumber(computation.blue, "NUMBER")) return `Invalid blue value '${computation.blue}'. Expected NUMBER.`;
            return null;

        case "CONDITION":
            if (!isValidVarOrNumber(computation.condition, "BOOLEAN")) return `Condition variable '${computation.condition}' must be BOOLEAN.`;
            if (!isValidVarOrNumber(computation.then, "NUMBER")) return `Invalid 'then' value '${computation.then}'. Expected NUMBER.`;
            if (!isValidVarOrNumber(computation.else, "NUMBER")) return `Invalid 'else' value '${computation.else}'. Expected NUMBER.`;
            return null;

        case "CONDITION_RGB":
            if (!isValidVarOrNumber(computation.condition, "BOOLEAN")) return `Condition variable '${computation.condition}' must be BOOLEAN.`;
            if (!isValidVarOrNumber(computation.then, "COLOR_RGB")) return `Invalid 'then' value '${computation.then}'. Expected COLOR_RGB.`;
            if (!isValidVarOrNumber(computation.else, "COLOR_RGB")) return `Invalid 'else' value '${computation.else}'. Expected COLOR_RGB.`;
            return null;

        case "LINEAR":
            if (!isValidVarOrNumber(computation.variable, "NUMBER")) return `Invalid variable '${computation.variable}'. Expected NUMBER.`;
            if (!isValidVarOrNumber(computation.factor, "NUMBER")) return `Invalid factor '${computation.factor}'. Expected NUMBER.`;
            if (!isValidVarOrNumber(computation.offset, "NUMBER")) return `Invalid offset '${computation.offset}'. Expected NUMBER.`;
            return null;

        case "LINEAR_RGB":
            if (!isValidVarOrNumber(computation.variable, "COLOR_RGB")) return `Invalid variable '${computation.variable}'. Expected COLOR_RGB.`;
            if (!isValidVarOrNumber(computation.factor, "NUMBER")) return `Invalid factor '${computation.factor}'. Expected NUMBER.`;
            if (!isValidVarOrNumber(computation.offset, "NUMBER")) return `Invalid offset '${computation.offset}'. Expected NUMBER.`;
            return null;

        default:
            return `Unknown computation type: '${computation.type}'.`;
    }
}

/**
 * Validates a script action and checks variable types.
 */
function validateAction(action: any, variableTypes: Map<string, VariableType>): string | null {
    if (!action || typeof action !== "object" || typeof action.type !== "string") {
        return "Invalid action structure.";
    }

    function isValidVarOrNumber(value: any, expectedType: VariableType): boolean {
        if (typeof value === "number") return expectedType === "NUMBER";
        if (typeof value === "string" && value.startsWith("$")) {
            return variableTypes.get(value.slice(1)) === expectedType;
        }
        return false;
    }

    switch (action.type) {
        case "IF_THEN_ELSE":
            if (!isValidVarOrNumber(action.condition, "BOOLEAN")) return `Condition '${action.condition}' must be BOOLEAN.`;
            if (!action.then || !Array.isArray(action.then) ||
                !action.else || !Array.isArray(action.else))
                return `IF_THEN_ELSE must contain two arrays: "then" and "else".`;
            for (const subAction of action.then) {
                const subError = validateAction(subAction, variableTypes);
                if (subError) return subError;
            }
            for (const subAction of action.else) {
                const subError = validateAction(subAction, variableTypes);
                if (subError) return subError;
            }
            return null;

        case "K_SET_PROGRAM":
            return typeof action.fixture === "string" && typeof action.program === "string"
                ? null
                : "Invalid K_SET_PROGRAM action structure.";

        case "K_SET_CONTINUOUS":
            if (!isValidVarOrNumber(action.value, "NUMBER"))
                return `Invalid or undefined variable in K_SET_CONTINUOUS: '${action.value}'. Expected NUMBER.`;
            if (!(typeof action.fixture === "string" && typeof action.program === "string" && typeof action.parameterName === "string"))
                return "Invalid K_SET_CONTINUOUS action structure.";
            return null;

        case "K_SET_DISCRETE":
            return typeof action.fixture === "string" && typeof action.program === "string" && typeof action.value === "string"
                ? null
                : "Invalid K_SET_DISCRETE action structure.";

        default:
            return `Unknown action type: '${action.type}'.`;
    }
}
