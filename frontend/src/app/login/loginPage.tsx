import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { loginUser } from "./loginApi";
import "./loginPage.css";
import background from "../../assets/landing.jpg";

const LoginPage: React.FC = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            const response = await loginUser(form.email, form.password);

            if (response.message) {
                setMessage(response.message);
                //localStorage.setItem("authToken", response.idToken);
                window.location.href = "/";
            } else {
                setError(response.error);
            }
        } catch (error) {
            setError("Server error. Please try again.");
            console.error("Login Failed", error);
        }
    };
    useEffect(() => {
        const verified = searchParams.get("verified");
        if (verified === "true") {
            setMessage("Email verified! You can now log in.");
            // Clear the query parameter from the URL to prevent persistence on refresh
            window.history.replaceState({}, document.title, "/login");
        }
    }, [searchParams]);

    return (
        <div
            style={{
            // borderRadius: "50px 50px 50px 50px",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            width: "100%",
            }}
            className="flex flex-col justify-center items-center"
        >
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {message && <p className="success">{message}</p>}
                    {error && <p className="error">{error}</p>}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        className="bg-[#5a3dc3ce] text-white
                                    px-6 py-3 border-none rounded-md
                                    cursor-pointer text-lg transition
                                    duration-300 mt-2 hover:bg-[#512fcace]
                                    active:bg-[#381aa2ce]"
                        type="submit">
                        Submit
                    </button>
                    <button
                        className="bg-transparent border border-[#666] cursor-pointer
                            rounded-md text-lg transition duration-300 text-white px-6 py-3
                            mt-1 mb-2 hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]"
                        onClick={() => window.location.href = "/reset-password"}>
                            Forgot Password?
                    </button>
                    <p>Don't have an account? <a href="/register" className="link">Register here</a></p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
