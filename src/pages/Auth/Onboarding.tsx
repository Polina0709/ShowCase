import { useNavigate } from "react-router-dom";

export default function Onboarding() {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p>You successfully created your account.</p>

            <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary mt-4"
            >
                Go to Dashboard
            </button>
        </div>
    );
}
