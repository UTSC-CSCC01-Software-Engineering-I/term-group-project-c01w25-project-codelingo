export const API_BASE_URL = "http://localhost:8081/api/auth";

export const registerUser = async (email: string, password: string, username: string) => {
    const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
    });

    return response.json();
};