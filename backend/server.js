
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

const { initializeApp, cert } = require("firebase-admin/app");
const {
    getFirestore,
    FieldValue,
} = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const verifyToken = require("./middleware/auth");

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount),
});

// Connect to Firestore
const db = getFirestore();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(
    cors({
        origin:
            process.env.FRONTEND_ORIGIN ||
            "http://localhost:5173",
    })
);

// Read JSON requests
app.use(express.json());

// Configure SendGrid
sgMail.setApiKey(process.env.sendgrid_api);

// Health check
app.get("/api/health", (request, response) => {
    response.status(200).json({
        message: "Backend is running.",
    });
});

// Newsletter subscription
app.post("/subscribe", async (request, response) => {
    const email =
        typeof request.body?.email === "string"
            ? request.body.email.trim()
            : "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
        return response.status(400).json({
            message: "Please enter a valid email address.",
        });
    }

    const message = {
        to: email,
        from: process.env.sendgrid_from_email,
        subject: "Welcome to DEV@Deakin!",
        text: "Thank you for subscribing to DEV@Deakin.",
        html: `
            <h1>Welcome to DEV@Deakin!</h1>
            <p>Thank you for subscribing to our newsletter.</p>
        `,
    };

    try {
        const result = await sgMail.send(message);

        console.log(
            "SendGrid Status Code:",
            result[0].statusCode
        );

        return response.status(200).json({
            message:
                "Thank you for subscribing! Please check your email.",
        });
    } catch (error) {
        console.error(
            "SendGrid error:",
            error.response?.body || error.message
        );

        return response.status(500).json({
            message:
                "Unable to send the welcome email. Please try again later.",
        });
    }
});

// Create a new post
app.post("/posts", verifyToken, async (request, response) => {
    try {
        const {
            postType,
            postPlan,
            title,
            description,
            abstract,
            articleText,
            tags,
        } = request.body;

        // Validate post type
        if (!["question", "article"].includes(postType)) {
            return response.status(400).json({
                message: "Please select a valid post type.",
            });
        }

        // Validate post plan
        if (!["Free", "Paid"].includes(postPlan)) {
            return response.status(400).json({
                message: "Please select a valid post plan.",
            });
        }

        // Validate title
        if (
            typeof title !== "string" ||
            !title.trim() ||
            title.trim().length > 150
        ) {
            return response.status(400).json({
                message: "Please enter a valid title (maximum 150 characters).",
            });
        }

        // Validate question description
        if (
            postType === "question" &&
            (typeof description !== "string" || !description.trim())
        ) {
            return response.status(400).json({
                message: "Please enter a question description.",
            });
        }

        // Validate article abstract
        if (
            postType === "article" &&
            (typeof abstract !== "string" || !abstract.trim())
        ) {
            return response.status(400).json({
                message: "Please enter an article abstract.",
            });
        }

        // Validate article text
        if (
            postType === "article" &&
            (typeof articleText !== "string" || !articleText.trim())
        ) {
            return response.status(400).json({
                message: "Please enter the article text.",
            });
        }

        // Validate tags
        if (!Array.isArray(tags) || tags.length > 3) {
            return response.status(400).json({
                message: "You can enter a maximum of 3 tags.",
            });
        }

        const cleanTags = [];

        for (const tag of tags) {
            if (
                typeof tag !== "string" ||
                !tag.trim() ||
                tag.trim().length > 30
            ) {
                return response.status(400).json({
                    message: "Please enter valid tags (maximum 30 characters each).",
                });
            }

            cleanTags.push(tag.trim());
        }

        // Get authenticated user ID from verified token
        const userId = request.user.uid;

        // Get user's subscription plan from Firestore
        const userSnapshot = await db
            .collection("users")
            .doc(userId)
            .get();

        const userPlan = userSnapshot.exists
            ? userSnapshot.data().subscriptionPlan || "Free"
            : "Free";

        // Only Paid users can create Paid posts
        if (postPlan === "Paid" && userPlan !== "Paid") {
            return response.status(403).json({
                message: "Upgrade to a Paid subscription to create Paid posts.",
            });
        }
        
        const username =(
            userSnapshot.exists &&
            userSnapshot.data().displayName) ||
            request.user.name ||
            request.user.email || "Anonymous";
        
        // Prepare post document
        const postData = {
            username,
            postType,
            postPlan,
            title: title.trim(),
            tags: cleanTags,
            userId,
            createdAt: FieldValue.serverTimestamp(),
        };

        if (postType === "question") {
            postData.description = description.trim();
        }

        if (postType === "article") {
            postData.abstract = abstract.trim();
            postData.articleText = articleText.trim();
        }

        // Save post in Firestore
        const postRef = await db
            .collection("posts")
            .add(postData);

        console.log("Post saved successfully:", postRef.id);

        return response.status(201).json({
            message: "Your post has been submitted successfully!",
            postId: postRef.id,
        });
    } catch (error) {
        console.error("Post creation error:", error);

        return response.status(500).json({
            message: "Unable to save your post. Please try again later.",
        });
    }
});

// Browse posts
app.get("/posts", async (request, response) => {
    try {
        let userPlan = "Free";

        // Check whether the request includes a Firebase ID token
        const authHeader = request.headers.authorization;

        if (authHeader) {
            if (!authHeader.startsWith("Bearer ")) {
                return response.status(401).json({
                    message: "Invalid authentication format.",
                });
            }

            try {
                const idToken = authHeader.split("Bearer ")[1];
                const decodedToken =
                    await getAuth().verifyIdToken(idToken);

                // Get subscription plan from Firestore
                const userSnapshot = await db
                    .collection("users")
                    .doc(decodedToken.uid)
                    .get();

                userPlan = userSnapshot.exists
                    ? userSnapshot.data().subscriptionPlan || "Free"
                    : "Free";
            } catch (authError) {
                return response.status(401).json({
                    message: "Invalid or expired authentication token.",
                });
            }
        }

        // Retrieve posts from Firestore
        const postsSnapshot = await db
            .collection("posts")
            .get();

        const posts = [];

        postsSnapshot.forEach((document) => {
            const post = document.data();

            // Free users and visitors can only see Free posts
            // Paid users can see both Free and Paid posts
            if (
                userPlan === "Paid" ||
                post.postPlan === "Free"
            ) {
                posts.push({
                    id: document.id,
                    ...post,
                    createdAt: post.createdAt
                        ? post.createdAt.toDate().toISOString()
                        : null,
                });
            }
        });

        // Sort posts by creation date, newest first
        posts.sort((a, b) => {
            return (
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            );
        });

        return response.status(200).json({
            posts,
            userPlan,
        });
    } catch (error) {
        console.error("Browse posts error:", error);

        return response.status(500).json({
            message: "Unable to retrieve posts. Please try again later.",
        });
    }
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
});
