import axios from "axios";
import { computeHMAC } from "./computeHMAC";
import { ThermocontrolSettableDataType } from "./ThermocontrolDetails";

export const sendDataToAPI = async (thermocontrolAPI: string, thermocontrolKey: string, data: ThermocontrolSettableDataType) => {
  if (!thermocontrolKey) {
      console.log("No thermocontrol key provided!")
      return;
  }
  try {
      // Fetch nonce
      const nonceResponse = await axios.get(thermocontrolAPI + "/nonce");
      const fetchedNonce = nonceResponse.data.nonce;

      // Build JSON string
      const jsonData = JSON.stringify({ ...data, nonce: fetchedNonce });

      // Compute HMAC
      const hmac = await computeHMAC(thermocontrolKey, jsonData);

      // Construct the request payload
      const payload = `${hmac}${jsonData}`;

      console.log("Sending payload: " + payload)

      // Send POST request
      await axios.post(thermocontrolAPI + "/json", payload, {
          headers: {
              'Content-Type': 'text/plain',
          },
      });

  } catch (error) {
      console.error('Error:', error);
  }
};