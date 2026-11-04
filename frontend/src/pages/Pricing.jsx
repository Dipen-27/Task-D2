
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Check, X, CreditCard, ShieldCheck } from "lucide-react";
import { db } from "../utilis/firebase";
import { useUser } from "../context/Usercontext";

function Pricing() {
    const {
        currentUser,
        userData,
        refreshUserData,
    } = useUser();

    const currentPlan = userData?.subscriptionPlan || "Free";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpgrade = () => {
        setMessage("");

        if (!currentUser) {
            setMessage("Please log in before upgrading your plan.");
            return;
        }

        if (currentPlan === "Paid") {
            setMessage("You are already on the Paid plan.");
            return;
        }

        setIsModalOpen(true);
    };

    const handleDowngrade = () => {
    setMessage("");

    if (!currentUser) {
        setMessage("Please log in to change your plan.");
        return;
    }

    if (currentPlan !== "Paid") {
        setMessage("You are already on the Free plan.");
        return;
    }

    setIsDowngradeModalOpen(true);
    };

    const confirmDowngrade = async () => {
    if (!currentUser || currentPlan !== "Paid") {
        setIsDowngradeModalOpen(false);
        return;
    }

    setSubmitting(true);
    setMessage("");

    try {
        const userRef = doc(db, "users", currentUser.uid);

        await updateDoc(userRef, {
        subscriptionPlan: "Free",
        });

        await refreshUserData();

        setIsDowngradeModalOpen(false);
        setMessage("Success! Your plan has been changed to Free.");
    } catch (error) {
        console.error("Downgrade failed:", error);
        setMessage("Unable to change your plan. Please try again.");
    } finally {
        setSubmitting(false);
    }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!cardName.trim()) {
            newErrors.cardName = "Enter the cardholder name.";
        }

        const digits = cardNumber.replace(/\s/g, "");

        if (!/^\d{16}$/.test(digits)) {
            newErrors.cardNumber = "Enter a 16-digit demo card number.";
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            newErrors.expiry = "Use MM/YY format.";
        } else {
            const [month, year] = expiry.split("/").map(Number);
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;

            if (
                year < currentYear ||
                (year === currentYear && month < currentMonth)
            ) {
                newErrors.expiry = "Enter a future expiry date.";
            }
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            newErrors.cvv = "Enter a 3 or 4-digit demo CVV.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!currentUser) {
            setMessage("Your session has expired. Please log in again.");
            setIsModalOpen(false);
            return;
        }

        if (currentPlan === "Paid") {
            setMessage("You are already on the Paid plan.");
            setIsModalOpen(false);
            return;
        }

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const userRef = doc(db, "users", currentUser.uid);

            await updateDoc(userRef, {
                subscriptionPlan: "Paid",
            });

            await refreshUserData();

            setIsModalOpen(false);
            setCardName("");
            setCardNumber("");
            setExpiry("");
            setCvv("");
            setErrors({});
            setMessage("Success! Your plan has been upgraded to Paid.");
        } catch (error) {
            console.error("Upgrade failed:", error);
            setMessage(
                "We couldn't update your plan. Please check your connection and try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const plans = [
        {
            name: "Free Plan",
            price: "$0",
            description: "Perfect for getting started.",
            features: [
                "Browse community posts",
                "Limited monthly posts",
                "Standard image uploads",
                "Basic community features",
            ],
        },
        {
            name: "Paid Plan",
            price: "$2.70",
            description: "Get more from DEV@Deakin.",
            features: [
                "Access to premium posts",
                "More monthly posts",
                "Larger image uploads",
                "Additional community features",
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800 sm:px-6 lg:px-8">
            <section className="mx-auto mb-12 max-w-3xl text-center">
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Choose Your Plan
                </h1>

                <p className="text-base leading-7 text-slate-600 sm:text-lg">
                    Find the right plan for your DEV@Deakin experience.
                </p>

                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-3 text-sm text-blue-800">
                    Your current plan:
                    <span className="font-bold">{currentPlan}</span>
                </p>

                {message && (
                    <p
                        role="status"
                        className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800"
                    >
                        {message}
                    </p>
                )}
            </section>

            <section className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-2">
                {plans.map((plan, index) => {
                    const isPaid = index === 1;
                    const isCurrentPlan =
                        (isPaid && currentPlan === "Paid") ||
                        (!isPaid && currentPlan === "Free");

                    return (
                        <article
                            key={plan.name}
                            className={`flex flex-col rounded-2xl border-2 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-9 ${
                                isPaid
                                    ? "border-transparent hover:border-blue-600"
                                    : "border-slate-200 hover:border-blue-600"
                            }`}
                        >
                            {isPaid && (
                                <span className="mb-4 w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                                    Recommended
                                </span>
                            )}

                            <h2 className="text-2xl font-bold text-slate-900">
                                {plan.name}
                            </h2>

                            <p className="mt-4 text-4xl font-bold text-blue-600">
                                {plan.price}
                                <span className="ml-1 text-sm font-normal text-slate-500">
                                    / month
                                </span>
                            </p>

                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                {plan.description}
                            </p>

                            <ul className="my-8 flex-1 space-y-4">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                                    >
                                        <Check
                                            size={18}
                                            strokeWidth={2.5}
                                            className="mt-1 shrink-0 text-green-600"
                                            aria-hidden="true"
                                        />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {isCurrentPlan ? (
                                <div className="mt-auto w-full rounded-lg bg-slate-100 px-4 py-3 text-center font-semibold text-slate-600">
                                    Your Current Plan
                                </div>
                            ) : isPaid ? (
                                <button
                                    type="button"
                                    onClick={handleUpgrade}
                                    className="mt-auto w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Upgrade Plan
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleDowngrade}
                                    className="mt-auto w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
                                >
                                    Downgrade to Free
                                </button>
                            )}
                        </article>
                    );
                })}
            </section>


            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !submitting) {
                            setIsModalOpen(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="upgrade-title"
                        className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2
                                    id="upgrade-title"
                                    className="text-2xl font-bold text-slate-900"
                                >
                                    Upgrade to Paid
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={submitting}
                                aria-label="Close payment form"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6 flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                            <CreditCard className="shrink-0 text-blue-600" size={28} />
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Paid Plan — $2.70/month
                                </p>
                                <p className="text-xs text-slate-600">
                                    For demonstration purposes only
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} noValidate>
                            <div className="mb-4">
                                <label
                                    htmlFor="cardName"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Cardholder name
                                </label>
                                <input
                                    id="cardName"
                                    autoComplete="off"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    aria-invalid={Boolean(errors.cardName)}
                                    aria-describedby={errors.cardName ? "cardName-error" : undefined}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Enter name"
                                />
                                {errors.cardName && (
                                    <p id="cardName-error" className="mt-1 text-sm text-red-600">
                                        {errors.cardName}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="cardNumber"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Demo card number
                                </label>
                                <input
                                    id="cardNumber"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ""))}
                                    aria-invalid={Boolean(errors.cardNumber)}
                                    aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="1234 5678 9012 3456"
                                />
                                {errors.cardNumber && (
                                    <p id="cardNumber-error" className="mt-1 text-sm text-red-600">
                                        {errors.cardNumber}
                                    </p>
                                )}
                            </div>

                            <div className="mb-5 grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="expiry"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Expiry (MM/YY)
                                    </label>
                                    <input
                                        id="expiry"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        aria-invalid={Boolean(errors.expiry)}
                                        aria-describedby={errors.expiry ? "expiry-error" : undefined}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="12/30"
                                    />
                                    {errors.expiry && (
                                        <p id="expiry-error" className="mt-1 text-sm text-red-600">
                                            {errors.expiry}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="cvv"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Demo CVV
                                    </label>
                                    <input
                                        id="cvv"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        aria-invalid={Boolean(errors.cvv)}
                                        aria-describedby={errors.cvv ? "cvv-error" : undefined}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="123"
                                    />
                                    {errors.cvv && (
                                        <p id="cvv-error" className="mt-1 text-sm text-red-600">
                                            {errors.cvv}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting ? "Upgrading..." : "Confirm Upgrade"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {isDowngradeModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !submitting) {
                        setIsDowngradeModalOpen(false);
                    }
                    }}
                >
                    <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="downgrade-title"
                    className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                    <h2
                        id="downgrade-title"
                        className="text-xl font-bold text-slate-900"
                    >
                        Switch to the Free Plan?
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Are you sure you want to downgrade? You will return to the
                        Free Plan and lose access to Paid Plan features.
                    </p>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                        type="button"
                        disabled={submitting}
                        onClick={() => setIsDowngradeModalOpen(false)}
                        className="rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                        Keep Paid Plan
                        </button>

                        <button
                        type="button"
                        disabled={submitting}
                        onClick={confirmDowngrade}
                        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        {submitting ? "Processing..." : "Confirm Downgrade"}
                        </button>
                    </div>
                    </section>
                </div>
            )}            
        </main>
    );
}

export default Pricing;
