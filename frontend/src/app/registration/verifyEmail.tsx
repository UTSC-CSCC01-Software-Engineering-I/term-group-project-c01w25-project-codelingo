import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { completeRegistration } from "./verifyEmailApi";

const VerifyEmail: React.FC = () => {
    const [message, setMessage] = useState("Verifying email...");
    const [searchParams] = useSearchParams();
    const hasVerified = useRef(false); // Add this to prevent double calls

    const verifyEmail = async (encryptedData: string) => {
        try {
            const data = await completeRegistration(encryptedData);
            if (data.error) {
                throw new Error(data.error);
            }

            setMessage("Email verified! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);

        } catch (error) {
            console.error("Verification error:", error);
            setMessage("Verification failed. Please try again.");
        }
    };

    useEffect(() => {
        console.log("Extracting verification data...");
        const encryptedData = searchParams.get("data");

        if (!encryptedData) {
            setMessage("Invalid verification link.");
            return;
        }

        if (!hasVerified.current) { // Only run if not already verified
            hasVerified.current = true;
            verifyEmail(encryptedData);
        }
    }, [searchParams]);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default VerifyEmail;