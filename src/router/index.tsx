import { createBrowserRouter } from "react-router-dom";

// Pages
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Onboarding from "../pages/Auth/Onboarding";
import Dashboard from "../pages/Dashboard/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder/ResumeBuilder";
import PublicResume from "../pages/PublicResume/PublicResume";
import ProfilePage from "../pages/ProfilePage"; // ✅ ДОДАНО

// Router guard
import ProtectedRoute from "./ProtectedRoute";

// Error page
import ErrorPage from "../pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/onboarding",
        element: <Onboarding />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/builder/:resumeId",
        element: (
            <ProtectedRoute>
                <ResumeBuilder />
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/r/:resumeId",
        element: <PublicResume />,
    },
]);
