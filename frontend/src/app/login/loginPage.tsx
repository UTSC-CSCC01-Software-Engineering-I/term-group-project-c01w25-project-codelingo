import React, { useState } from "react";
import { loginUser } from "./loginApi";
import "./LoginPage.css";
import background from "../../assets/landing.jpg";

const LoginPage: React.FC = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                //navigate("/discussions");
            } else {
                setError(response.error);
            }
        } catch (error) {
            setError("Server error. Please try again.");
            console.error("Login Failed", error);
        }
    };

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
                <button type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default LoginPage;
