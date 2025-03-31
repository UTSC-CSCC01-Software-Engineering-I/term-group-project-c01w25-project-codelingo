import { config } from '../../config.ts';

export const completeRegistration = async (encryptedData: string) => {
    const response = await fetch(`${config.api.auth}/complete-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encryptedData }),
    });
  
    return response.json();
  };