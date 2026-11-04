
import { useState } from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed.");
      }

      setMessage(data.message);
      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-teal-600 text-white">
      {/* Sign up bar */}
      <div className="w-full px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-teal-500">
        <p className="font-bold tracking-wide text-center md:text-left">
          Sign up for our daily insider
        </p>

        <div className="w-full md:w-auto">
          <form
            onSubmit={handleSubscribe}
            className="flex gap-2 w-full"
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Newsletter email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-gray-800 flex-1 md:w-64"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-teal-700 font-semibold px-5 py-2 rounded-md hover:bg-gray-100 disabled:opacity-60"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-3 text-sm ${
                isSuccess ? "text-white" : "text-white"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Link columns */}
      <div className="w-full px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h4 className="font-bold mb-3">Explore</h4>
          <ul className="space-y-2 text-teal-50">
            <li>Home</li>
            <li>Questions</li>
            <li>Articles</li>
            <li>Tutorials</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Support</h4>
          <ul className="space-y-2 text-teal-50">
            <li>FAQs</li>
            <li>Help</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Stay connected</h4>

          <div className="flex justify-center md:justify-start gap-3">
            <span className="bg-teal-700 p-2 rounded-md">
              <Facebook size={18} />
            </span>

            <span className="bg-teal-700 p-2 rounded-md">
              <Twitter size={18} />
            </span>

            <span className="bg-teal-700 p-2 rounded-md">
              <Instagram size={18} />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full border-t border-teal-500 py-6 text-center text-sm">
        <p className="font-semibold mb-2">DEV@Deakin 2026</p>

        <div className="flex justify-center gap-4 text-teal-50">
          <span>Privacy Policy</span>
          <span>Terms</span>
          <span>Code of Conduct</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
