import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, createUserDocFromAuth } from "../utilis/firebase";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (event) => {
        event.preventDefault();
        setError("");


        if (name.trim() === "") {
            setError("Please enter your full name.");
            return;
        }


        if (email.trim() === "") {
            setError("Please enter your email.");
            return;
        }


        if (password === "") {
            setError("Please enter a password.");
            return;
        }


        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }


        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name.trim()
            });

            await createUserDocFromAuth({
                ...user,
                displayName: name.trim()
            });

            navigate("/login");

        } catch (error) {
            console.log(error);

            if (error.code === "auth/email-already-in-use") {
                setError("This email is already registered.");
            } 
            else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } 
            else if (error.code === "auth/weak-password") {
                setError("Password is too weak.");
            } 
            else {
                setError("Unable to create account. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">

            <form
                onSubmit={handleSignup}
                className="w-full max-w-lg bg-white border border-gray-200 rounded-xl p-8 shadow-lg"
            >
                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create an Account
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Join the DEV@Deakin community
                    </p>
                </div>

                {/* Name */}
                <div className="mb-5">
                    <label
                        htmlFor="signup-name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Name
                    </label>

                    <input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        autoComplete="name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Email */}
                <div className="mb-5">
                    <label
                        htmlFor="signup-email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Email
                    </label>

                    <input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        autoComplete="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Password */}
                <div className="mb-5">
                    <label
                        htmlFor="signup-password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Password
                    </label>

                    <input
                        id="signup-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Confirm password */}
                <div className="mb-6">
                    <label
                        htmlFor="signup-confirm-password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Confirm password
                    </label>

                    <input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3"
                    >
                        <p className="text-red-600 text-sm">
                            {error}
                        </p>
                    </div>
                )}

                {/* Create account button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition hover:bg-blue-700 active:bg-blue-800"
                >
                    Create Account
                </button>

                {/* Login link */}
                <div className="text-center mt-7">
                    <span className="text-gray-500">
                        Already have an account?{" "}
                    </span>

                    <Link
                        to="/login"
                        className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;
