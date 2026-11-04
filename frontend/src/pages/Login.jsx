import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
    auth,
    signInWithGoogleAuthProvider,
    createUserDocFromAuth,
} from "../utilis/firebase";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Store Firebase user ID and ID token in Local Storage.
    const storeUserCredentials = async (user) => {
        const token = await user.getIdToken();

        localStorage.setItem("userId", user.uid);
        localStorage.setItem("token", token);
    };

    const handleGoogleLogin = async () => {
        setError("");

        try {
            const response = await signInWithGoogleAuthProvider();
            const user = response.user;

            await createUserDocFromAuth(user);
            await storeUserCredentials(user);

            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Unable to sign in with Google. Please try again.");
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        if (email.trim() === "") {
            setError("Please enter your email.");
            return;
        }

        if (password === "") {
            setError("Please enter your password.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            await storeUserCredentials(userCredential.user);

            navigate("/");
        } catch (error) {
            console.error(error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {
                setError(
                    "Incorrect email or password. Please try again or sign up."
                );
            } else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else {
                setError("Unable to log in. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-lg"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Login
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Welcome back to DEV@Deakin
                    </p>
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition hover:bg-blue-700 active:bg-blue-800"
                >
                    Login
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>

                    <span className="px-4 text-sm text-gray-400">OR</span>

                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 py-3 rounded-lg font-semibold transition hover:bg-gray-50 hover:border-gray-400"
                >
                    <img
                        src="/pics_for_website/google-icon-logo.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />

                    Continue with Google
                </button>

                <div className="text-center mt-7">
                    <span className="text-gray-500">
                        Don't have an account?{" "}
                    </span>

                    <Link
                        to="/signup"
                        className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
