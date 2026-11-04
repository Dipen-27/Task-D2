
import { useState } from "react";
import { useUser } from "../context/Usercontext";

function Post() {
    const { currentUser, loading } = useUser();

    const [postType, setPostType] = useState("question");
    const [postPlan, setPostPlan] = useState("Free");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [abstract, setAbstract] = useState("");
    const [articleText, setArticleText] = useState("");
    const [tags, setTags] = useState("");

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const clearError = (field) => {
        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handlePostTypeChange = (type) => {
        setPostType(type);
        setErrors({});
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setIsSuccess(false);

        // Check authentication
        if (loading) {
            return;
        }

        if (!currentUser) {
            setMessage("Please log in before submitting a post.");
            return;
        }

        const newErrors = {};

        // Validate title
        if (!title.trim()) {
            newErrors.title = "Please enter a title.";
        }

        // Validate question
        if (
            postType === "question" &&
            !description.trim()
        ) {
            newErrors.description =
                "Please describe your problem.";
        }

        // Validate article abstract
        if (
            postType === "article" &&
            !abstract.trim()
        ) {
            newErrors.abstract =
                "Please enter an abstract.";
        }

        // Validate article text
        if (
            postType === "article" &&
            !articleText.trim()
        ) {
            newErrors.articleText =
                "Please enter the article text.";
        }

        // Validate tags
        const tagList = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "");

        if (tagList.length > 3) {
            newErrors.tags =
                "You can enter a maximum of 3 tags.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setSubmitting(true);

            // Get a fresh Firebase ID token
            const token = await currentUser.getIdToken();

            // Prepare post data
            const postData = {
                postType,
                postPlan,
                title: title.trim(),
                description:
                    postType === "question"
                        ? description.trim()
                        : "",
                abstract:
                    postType === "article"
                        ? abstract.trim()
                        : "",
                articleText:
                    postType === "article"
                        ? articleText.trim()
                        : "",
                tags: tagList,
            };

            // Send post to Express backend
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/posts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to submit your post."
                );
            }

            setIsSuccess(true);
            setMessage(
                data.message || "Your post was submitted successfully!"
            );

            // Automatically hide the success message after 4 seconds
            setTimeout(() => {
                setMessage("");
                setIsSuccess(false);
            }, 4000);

            // Reset form after successful submission
            setTitle("");
            setDescription("");
            setAbstract("");
            setArticleText("");
            setTags("");
            setPostType("question");
            setPostPlan("Free");
            setErrors({});

        } catch (error) {
            console.error("Post submission error:", error);

            setIsSuccess(false);
            setMessage(
                error.message || "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 w-full bg-gray-100 px-4 py-8">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md sm:p-8">

                <h1 className="mb-6 bg-gray-200 px-4 py-3 text-xl font-bold text-gray-800">
                    New Post
                </h1>

                {/* Post type selection */}
                <div className="mb-6">
                    <p className="mb-3 font-medium text-gray-700">
                        Select Post Type:
                    </p>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="postType"
                                value="question"
                                checked={postType === "question"}
                                onChange={() =>
                                    handlePostTypeChange("question")
                                }
                                className="accent-blue-600"
                            />
                            Question
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="postType"
                                value="article"
                                checked={postType === "article"}
                                onChange={() =>
                                    handlePostTypeChange("article")
                                }
                                className="accent-blue-600"
                            />
                            Article
                        </label>
                    </div>
                </div>

                {/* Post plan selection */}
                <div className="mb-6">
                    <p className="mb-3 font-medium text-gray-700">
                        Select Post Plan:
                    </p>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="postPlan"
                                value="Free"
                                checked={postPlan === "Free"}
                                onChange={() => setPostPlan("Free")}
                                className="accent-blue-600"
                            />
                            Free
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="postPlan"
                                value="Paid"
                                checked={postPlan === "Paid"}
                                onChange={() => setPostPlan("Paid")}
                                className="accent-blue-600"
                            />
                            Paid
                        </label>
                    </div>
                </div>

                {/* Post form */}
                <form onSubmit={handleSubmit} noValidate>

                    <h2 className="mb-4 bg-gray-200 px-4 py-3 font-semibold text-gray-800">
                        What do you want to ask or share
                    </h2>

                    {/* Title */}
                    <div className="mb-5">
                        <label
                            htmlFor="title"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                clearError("title");
                            }}
                            placeholder="Enter a descriptive title"
                            aria-invalid={Boolean(errors.title)}
                            className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                                errors.title
                                    ? "border-red-400 focus:ring-red-100"
                                    : "border-gray-300 focus:ring-blue-200"
                            }`}
                        />

                        {errors.title && (
                            <p className="mt-2 text-sm text-red-600" role="alert">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Question fields */}
                    {postType === "question" && (
                        <div className="mb-5">
                            <label
                                htmlFor="description"
                                className="mb-2 block font-medium text-gray-700"
                            >
                                Describe your problem
                            </label>

                            <textarea
                                id="description"
                                rows="9"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    clearError("description");
                                }}
                                placeholder="Describe your question or problem..."
                                className={`w-full resize-y rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                                    errors.description
                                        ? "border-red-400 focus:ring-red-100"
                                        : "border-gray-300 focus:ring-blue-200"
                                }`}
                            />

                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600" role="alert">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Article fields */}
                    {postType === "article" && (
                        <>
                            <div className="mb-5">
                                <label
                                    htmlFor="abstract"
                                    className="mb-2 block font-medium text-gray-700"
                                >
                                    Abstract
                                </label>

                                <textarea
                                    id="abstract"
                                    rows="3"
                                    value={abstract}
                                    onChange={(e) => {
                                        setAbstract(e.target.value);
                                        clearError("abstract");
                                    }}
                                    placeholder="Enter a one-paragraph abstract"
                                    className={`w-full resize-y rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                                        errors.abstract
                                            ? "border-red-400 focus:ring-red-100"
                                            : "border-gray-300 focus:ring-blue-200"
                                    }`}
                                />

                                {errors.abstract && (
                                    <p className="mt-2 text-sm text-red-600" role="alert">
                                        {errors.abstract}
                                    </p>
                                )}
                            </div>

                            <div className="mb-5">
                                <label
                                    htmlFor="articleText"
                                    className="mb-2 block font-medium text-gray-700"
                                >
                                    Article Text
                                </label>

                                <textarea
                                    id="articleText"
                                    rows="9"
                                    value={articleText}
                                    onChange={(e) => {
                                        setArticleText(e.target.value);
                                        clearError("articleText");
                                    }}
                                    placeholder="Write your article here..."
                                    className={`w-full resize-y rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                                        errors.articleText
                                            ? "border-red-400 focus:ring-red-100"
                                            : "border-gray-300 focus:ring-blue-200"
                                    }`}
                                />

                                {errors.articleText && (
                                    <p className="mt-2 text-sm text-red-600" role="alert">
                                        {errors.articleText}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Tags */}
                    <div className="mb-6">
                        <label
                            htmlFor="tags"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Tags
                        </label>

                        <input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(e) => {
                                setTags(e.target.value);
                                clearError("tags");
                            }}
                            placeholder="Add up to 3 tags, e.g., Java"
                            className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                                errors.tags
                                    ? "border-red-400 focus:ring-red-100"
                                    : "border-gray-300 focus:ring-blue-200"
                            }`}
                        />

                        <p className="mt-1 text-sm text-gray-500">
                            Separate tags with commas. Maximum 3 tags.
                        </p>

                        {errors.tags && (
                            <p className="mt-2 text-sm text-red-600" role="alert">
                                {errors.tags}
                            </p>
                        )}
                    </div>

                    {/* Success and error messages */}
                    {message && (
                        <div
                            role="alert"
                            className={`mb-5 rounded-md p-3 text-sm ${
                                isSuccess
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    {/* Post button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || submitting}
                            className="rounded-md bg-blue-600 px-8 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Loading..."
                                : submitting
                                    ? "Submitting..."
                                    : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Post;
