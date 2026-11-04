
import { useEffect, useState } from "react";
import { useUser } from "../context/Usercontext";

function BrowsePosts() {
    const { currentUser, loading: userLoading } = useUser();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userPlan, setUserPlan] = useState("Free");

    // Filter states
    const [postTypeFilter, setPostTypeFilter] = useState("All");
    const [postPlanFilter, setPostPlanFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");

    // Hidden posts and popup state
    const [hiddenPostIds, setHiddenPostIds] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    // Close popup using Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedPost(null);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Fetch posts from backend
    useEffect(() => {
        if (userLoading) return;

        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const headers = {};

                // Add Firebase ID token for logged-in users
                if (currentUser) {
                    const token = await currentUser.getIdToken();
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/posts`,
                    {
                        method: "GET",
                        headers,
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to fetch posts."
                    );
                }

                setPosts(data.posts || []);
                setUserPlan(data.userPlan || "Free");

            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.message || "Unable to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentUser, userLoading]);

    // Format post date
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleString();
    };

    // Convert date to local YYYY-MM-DD format
    const getLocalDate = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Hide a post without deleting it
    const hidePost = (postId) => {
        setHiddenPostIds((previousIds) => [
            ...previousIds,
            postId,
        ]);
    };

    // Apply filters
    const filteredPosts = posts.filter((post) => {
        const matchesType =
            postTypeFilter === "All" ||
            post.postType === postTypeFilter;

        const matchesPlan =
            postPlanFilter === "All" ||
            post.postPlan === postPlanFilter;

        const matchesDate =
            !dateFilter ||
            getLocalDate(post.createdAt) === dateFilter;

        const matchesTag =
            !tagFilter.trim() ||
            (post.tags || []).some((tag) =>
                tag.toLowerCase().includes(
                    tagFilter.trim().toLowerCase()
                )
            );

        return (
            matchesType &&
            matchesPlan &&
            matchesDate &&
            matchesTag
        );
    });

    // Remove hidden posts from displayed results
    const visiblePosts = filteredPosts.filter(
        (post) => !hiddenPostIds.includes(post.id)
    );

    // Reset all filters and restore hidden posts
    const resetPage = () => {
        setPostTypeFilter("All");
        setPostPlanFilter("All");
        setDateFilter("");
        setTagFilter("");
        setHiddenPostIds([]);
        setSelectedPost(null);
    };

    return (
        <div className="flex-1 w-full bg-gray-100 px-4 py-8">
            <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-md">

                {/* Page heading */}
                <h1 className="mb-4 bg-gray-200 px-4 py-3 text-xl font-bold text-gray-800">
                    Browse Posts
                </h1>

                {/* Subscription plan */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-gray-600">
                        Explore questions and articles from the community.
                    </p>

                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        Your Plan: {userPlan}
                    </span>
                </div>

                {/* Filters */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">

                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Filter Posts
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Post type filter */}
                        <div>
                            <label
                                htmlFor="typeFilter"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Post Type
                            </label>

                            <select
                                id="typeFilter"
                                value={postTypeFilter}
                                onChange={(e) => setPostTypeFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                            >
                                <option value="All">All Types</option>
                                <option value="question">Question</option>
                                <option value="article">Article</option>
                            </select>
                        </div>

                        {/* Post plan filter */}
                        <div>
                            <label
                                htmlFor="planFilter"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Post Plan
                            </label>

                            <select
                                id="planFilter"
                                value={postPlanFilter}
                                onChange={(e) => setPostPlanFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                            >
                                <option value="All">All Plans</option>
                                <option value="Free">Free</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        {/* Date filter */}
                        <div>
                            <label
                                htmlFor="dateFilter"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Created Date
                            </label>

                            <input
                                id="dateFilter"
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                            />
                        </div>

                        {/* Tag filter */}
                        <div>
                            <label
                                htmlFor="tagFilter"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Search by Tag
                            </label>

                            <input
                                id="tagFilter"
                                type="text"
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                placeholder="e.g. Java"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Result count and reset */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">
                            Showing {visiblePosts.length} of {posts.length} posts
                        </p>

                        <button
                            type="button"
                            onClick={resetPage}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="py-8 text-center text-gray-600">
                        Loading posts...
                    </p>
                )}

                {/* Error */}
                {!loading && error && (
                    <p
                        role="alert"
                        className="rounded-md bg-red-100 p-4 text-red-700"
                    >
                        {error}
                    </p>
                )}

                {/* No posts */}
                {!loading && !error && posts.length === 0 && (
                    <p className="py-8 text-center text-gray-600">
                        No posts are available yet.
                    </p>
                )}

                {/* No matching posts */}
                {!loading && !error && posts.length > 0 && visiblePosts.length === 0 && (
                    <p className="py-8 text-center text-gray-600">
                        No posts match your selected filters.
                    </p>
                )}

                {/* Posts list */}
                {!loading && !error && visiblePosts.length > 0 && (
                    <div className="space-y-5">

                        {visiblePosts.map((post) => (
                            <article
                                key={post.id}
                                className="rounded-lg border border-gray-200 p-5 shadow-sm"
                            >

                                {/* Post type and plan */}
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                    <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium capitalize text-gray-700">
                                        {post.postType}
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                            post.postPlan === "Paid"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {post.postPlan}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="mb-2 text-xl font-bold text-gray-800">
                                    {post.title}
                                </h2>

                                {/* Author and date */}
                                <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                                    <span>
                                        Posted by: {post.username || "Anonymous"}
                                    </span>

                                    <span>
                                        {formatDate(post.createdAt)}
                                    </span>
                                </div>

                                {/* Post preview */}
                                <p className="mb-4 whitespace-pre-wrap text-gray-700">
                                    {post.postType === "question"
                                        ? (post.description || "").slice(0, 180)
                                        : (post.abstract || "").slice(0, 180)
                                    }
                                    {(post.postType === "question"
                                        ? (post.description || "").length
                                        : (post.abstract || "").length
                                    ) > 180 && "..."}
                                </p>

                                {/* Tags */}
                                {post.tags?.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={`${post.id}-${index}`}
                                                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">

                                    <button
                                        type="button"
                                        onClick={() => setSelectedPost(post)}
                                        className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Open Full Post
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => hidePost(post.id)}
                                        className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Hide
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Full post popup */}
            {selectedPost && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="full-post-title"
                        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Popup heading */}
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-xl font-bold text-gray-800">
                                Full Post
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedPost(null)}
                                aria-label="Close popup"
                                className="rounded-md px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Post type and plan */}
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="rounded bg-gray-100 px-3 py-1 text-sm capitalize">
                                {selectedPost.postType}
                            </span>

                            <span className={`rounded-full px-3 py-1 text-sm ${
                                selectedPost.postPlan === "Paid"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-700"
                            }`}>
                                {selectedPost.postPlan}
                            </span>
                        </div>

                        {/* Post title */}
                        <h3
                            id="full-post-title"
                            className="mb-3 text-2xl font-bold text-gray-800"
                        >
                            {selectedPost.title}
                        </h3>

                        {/* Author and date */}
                        <p className="mb-4 text-sm text-gray-500">
                            Posted by: {selectedPost.username || "Anonymous"}
                            {" · "}
                            {formatDate(selectedPost.createdAt)}
                        </p>

                        {/* Article abstract */}
                        {selectedPost.postType === "article" && (
                            <div className="mb-4">
                                <h4 className="mb-2 font-semibold">
                                    Abstract
                                </h4>

                                <p className="whitespace-pre-wrap text-gray-700">
                                    {selectedPost.abstract}
                                </p>
                            </div>
                        )}

                        {/* Full content */}
                        <div>
                            <h4 className="mb-2 font-semibold">
                                {selectedPost.postType === "question"
                                    ? "Description"
                                    : "Article Content"
                                }
                            </h4>

                            <p className="whitespace-pre-wrap text-gray-700">
                                {selectedPost.postType === "question"
                                    ? selectedPost.description
                                    : selectedPost.articleText
                                }
                            </p>
                        </div>

                        {/* Tags */}
                        {selectedPost.tags?.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {selectedPost.tags.map((tag, index) => (
                                    <span
                                        key={`${selectedPost.id}-${index}`}
                                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Close button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedPost(null)}
                                className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BrowsePosts;
