import { admin, db } from '../../../shared/initFirebase.js';
import { sendVerificationEmail } from '../services/authService.js';
import crypto from "crypto-js";

export default {
    async register(req, res) {
        try {
            const { email, username, password } = req.body;

            if (!email || !password || !username) {
                return res.status(400).json({ error: 'Missing parameters in the request body' });
            }

            let checkExistEmail;
            try {
                checkExistEmail = await admin.auth().getUserByEmail(email);
            } catch (err) {
                if (err.code !== 'auth/user-not-found') {
                    throw err;
                }
            }

            if (checkExistEmail) {
                return res.status(401).json({ error: 'The email is already taken.' });
            }

            const usersSnapshot = await db.ref('users').orderByChild('username').equalTo(username).get();
            if (usersSnapshot.exists()) {
                return res.status(402).json({ error: 'The username is already taken.' });
            }
            /*
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: username
            });

            await db.ref(`users/${userRecord.uid}`).set({
                email,
                username
            });
            */
            const secretKey = 'SUPERDUPERSECRETKEY';
            const encryptedData = crypto.AES.encrypt(
                JSON.stringify({ email, username, password }),
                secretKey
            ).toString();

            const verificationUrl = `http://localhost:5173/verify-email?data=${encodeURIComponent(encryptedData)}`;
            await sendVerificationEmail(email, verificationUrl);
        
            return res.status(201).json({
                message: 'Email verification sent',
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    },
    async completeRegistration(req, res) {
        try {
            console.log("COMPLETING REGISTRATION");
            const { encryptedData } = req.body;
    
            if (!encryptedData) {
                return res.status(400).json({ error: "Invalid request parameters." });
            }
    
            // Decrypt the data
            const secretKey = 'SUPERDUPERSECRETKEY';
            const decryptedBytes = crypto.AES.decrypt(decodeURIComponent(encryptedData), secretKey);
            const decryptedData = JSON.parse(decryptedBytes.toString(crypto.enc.Utf8));
            const { email, username, password } = decryptedData;
    
            console.log("Decrypted data:", decryptedData);
            console.log("Email:", email);
            console.log("Username:", username);
            console.log("Password:", password);
    
            // Step 1: Check if the user already exists
            let userRecord;
            try {
                userRecord = await admin.auth().getUserByEmail(email);
                console.log("User already exists:", userRecord.uid);
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    // Step 2: If user doesn’t exist, create them
                    userRecord = await admin.auth().createUser({
                        email,
                        password,
                        displayName: username
                    });
                    console.log("User created:", userRecord.uid);
                } else {
                    // Handle unexpected errors (e.g., network issues)
                    console.error("Error checking user:", error);
                    return res.status(500).json({ error: "Failed to verify user existence." });
                }
            }
    
            // Manually set emailVerified to true (this is the verification step)
            if (!userRecord.emailVerified) {
                await admin.auth().updateUser(userRecord.uid, {
                    emailVerified: true
                });
                console.log("Email manually marked as verified:", userRecord.uid);
            } else {
                console.log("Email already verified:", userRecord.uid);
            }
    
            // Step 4: Save user details in Realtime Database if not already present
            const userRef = db.ref(`users/${userRecord.uid}`);
            const snapshot = await userRef.once("value");
            if (!snapshot.exists()) {
                await userRef.set({
                    email,
                    username
                });
                console.log("User data saved in database:", userRecord.uid);
            } else {
                console.log("User data already exists in database:", userRecord.uid);
            }
    
            // Step 5: Return success response
            return res.status(201).json({
                message: "User successfully registered",
                uid: userRecord.uid
            });
    
        } catch (err) {
            console.error("Registration error:", err);
            return res.status(500).json({ error: err.message });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Missing parameters in the request body' });
            }

            const signIn = async (email, password) => {
                const apiKey = process.env.FIREBASE_API_KEY;
                const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        returnSecureToken: true
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error.message);
                }
                return data.idToken;
            };
            const idToken = await signIn(email, password);

            return res.status(200).json({
                message: 'Login successful',
                idToken
            });
 
        } catch (err) {
            console.error(err);
            res.status(401).json({ error: err.message });
        }
    },
    async resetPassword(req, res) {
        try {
            const { oobCode, newPassword } = req.body;
    
            if (!oobCode || !newPassword) {
                return res.status(400).json({ error: "oobCode and new password are required." });
            }
    
            await admin.auth().verifyPasswordResetCode(oobCode);
            await admin.auth().confirmPasswordReset(oobCode, newPassword);
            console.log("Password reset successful");
    
            return res.status(200).json({
                message: "Password has been successfully reset. Please log in with your new password."
            });
    
        } catch (err) {
            console.error("Password reset error:", err);
            return res.status(500).json({ error: err.message });
        }
    }
};


    