
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/Usercontext";

function Navbar() {
    const { currentUser, logout, loading } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="w-full bg-gray-200 px-6 py-3">
            <div className="w-full flex items-center gap-4 flex-wrap">

                <Link
                    to="/"
                    className="font-bold text-gray-800 hover:text-blue-600 whitespace-nowrap"
                >
                    DEV@Deakin
                </Link>

                <div className="flex-1 min-w-0">
                    <input
                        type="text"
                        placeholder="Search..."
                        aria-label="Search"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                <Link
                    to="/post"
                    className="px-4 py-2 text-gray-800 hover:text-blue-600"
                >
                    Post
                </Link>

                <Link
                    to="/browse-posts"
                    className="px-4 py-2 text-gray-800 hover:text-blue-600"
                >
                    Browse Posts
                </Link>

                <Link
                    to="/pricing"
                    className="px-4 py-2 text-gray-800 hover:text-blue-600"
                >
                    Pricing
                </Link>

                {!loading && (
                    currentUser ? (
                        <>
                            <span className="text-sm text-gray-700">
                                {currentUser.displayName ||
                                    currentUser.email}
                            </span>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="px-4 py-2 text-gray-800 hover:text-blue-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-gray-800 hover:text-blue-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="px-4 py-2 text-gray-800 hover:text-blue-600"
                            >
                                Signup
                            </Link>
                        </>
                    )
                )}

            </div>
        </nav>
    );
}

export default Navbar;
