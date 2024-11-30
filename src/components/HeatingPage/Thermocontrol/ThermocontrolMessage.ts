import { ThermocontrolSettableDataType } from "./ThermocontrolDetails";

export type TcMessage = {
    messageType: "update";
    data: TcUpdates;
  } |
  {
    messageType: "error" | "tokenError";
    error: string;
  };

export type TcUpdates = {
    type: "tc";
    stale: boolean;
    data: TcData;
  } |
  {
    type: "tc_aux",
    stale: boolean,
    data_aux: TcAuxData
  };

export type TcAuxData = {
    [key: string]: number | boolean | string;
};

export interface TcData extends ThermocontrolSettableDataType {
    emergency_heating_is_active: boolean;
    data_age_humidity: number;
    data_age_temperature: number;
}