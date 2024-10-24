import { ThermocontrolSettableDataType } from "./ThermocontrolDetails";

export interface ThermocontrolMessage {
    // tokenError hints at an expired or invalid token and should be handled by the UI by logging out the user
    messageType: "update" | "error" | "tokenError";
    // should be set if message type is error or tokenError. It is a human-readable error message
    error?: string;
    health?: "good" | "error";
    data?: TCUpdates;
};

export type TCUpdates = {
    type: "tc" | "tc_aux";
    stale: boolean;
    data?: ThermocontrolDataType;
    data_aux?: ThermocontrolAuxData;
}

export type ThermocontrolAuxData = {
    [key: string]: number | boolean | string;
};

export interface ThermocontrolDataType extends ThermocontrolSettableDataType {
    emergency_heating_is_active: boolean;
    data_age_humidity: number;
    data_age_temperature: number;
}