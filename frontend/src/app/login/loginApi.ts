import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";


import { config } from '../../config.ts';

export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${config.api.auth}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const bruh = await signInWithEmailAndPassword(auth, email, password);
    console.log(bruh);
    return response.json();
};

export const resetPassword = async (oobCode: string, newPassword: string) => {
    const response = await fetch(`${config.api.auth}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oobCode, newPassword }),
    });
    return response.json();
};