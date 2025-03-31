import { config } from '../../config.ts';

export const registerUser = async (email: string, password: string, username: string) => {
    const response = await fetch(`${config.api.auth}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
  
    return response.json();
  };