import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Resume } from "../../types/resume";
import { listenToResume, updateResume } from "../../services/dbResumes";
import SectionSidebar from "./SectionSidebar";
import SectionEditor from "./SectionEditor";

export default function ResumeBuilder() {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState<Resume | null>(null);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

    useEffect(() => {
        if (!resumeId) return;
        listenToResume(resumeId, setResume);
    }, [resumeId]);

    const saveChanges = (changes: Partial<Resume>) => {
        if (!resumeId) return;

        updateResume(resumeId, changes);
    };

    const handleBackClick = () => {
        if (!resume) return;
        if (resume.isPublished) {
            navigate("/dashboard");
        } else {
            setShowLeaveModal(true);
            setPendingNavigation(() => () => navigate("/dashboard"));
        }
    };

    const publishNow = async () => {
        if (!resumeId) return;
        await updateResume(resumeId, { isPublished: true });
        setShowLeaveModal(false);
        if (pendingNavigation) pendingNavigation();
    };

    const leaveAsDraft = () => {
        setShowLeaveModal(false);
        if (pendingNavigation) pendingNavigation();
    };

    if (!resume) return <div className="p-6">Loading resume...</div>;

    return (
        <div className="flex min-height-screen">

            {/* 🔙 BACK BUTTON */}
            <button
                onClick={handleBackClick}
                className="absolute top-4 left-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
                ← Back to Dashboard
            </button>

            {/* Sidebar */}
            <SectionSidebar resume={resume} saveChanges={saveChanges} />

            {/* Editor */}
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-4">

                    <input
                        className="text-3xl font-bold w-full border-b border-gray-200 outline-none"
                        value={resume.title}
                        onChange={(e) => saveChanges({ title: e.target.value })}
                    />

                    <button
                        onClick={() => saveChanges({ isPublished: !resume.isPublished })}
                        className={`px-3 py-2 rounded ${
                            resume.isPublished ? "bg-yellow-600" : "bg-green-600"
                        } text-white`}
                    >
                        {resume.isPublished ? "Unpublish" : "Publish"}
                    </button>
                </div>

                <SectionEditor resume={resume} saveChanges={saveChanges} />
            </div>

            {showLeaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm p-5 text-center animate-fadeIn">

                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Resume is not published
                        </h2>

                        <p className="text-gray-600 text-sm mb-6">
                            Do you want to publish it now or keep it as a draft?
                        </p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={publishNow}
                                className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition active:scale-[0.98]"
                            >
                                Publish Resume
                            </button>

                            <button
                                onClick={leaveAsDraft}
                                className="py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition active:scale-[0.98]"
                            >
                                Save as Draft
                            </button>

                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="text-sm text-gray-500 mt-1 hover:underline"
                            >
                                Continue Editing
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
