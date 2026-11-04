
const { getAuth } = require("firebase-admin/auth");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required. Please log in."
            });
        }

        const idToken = authHeader.split("Bearer ")[1];

        // Verify Firebase ID token
        const decodedToken = await getAuth().verifyIdToken(idToken);

        // Attach authenticated user information
        req.user = decodedToken;

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
};

module.exports = verifyToken;
