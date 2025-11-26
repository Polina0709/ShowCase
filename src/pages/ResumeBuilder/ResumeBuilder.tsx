import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Resume } from "../../types/resume";
import { listenToResume, updateResume } from "../../services/dbResumes";
import SectionSidebar from "./SectionSidebar";
import SectionEditor from "./SectionEditor";
import "./resume-builder.css";
import bg from "../../assets/bg.jpg";
import ExportToPDF from "../../components/ExportToPDF";

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

    if (!resume) return <div className="loading-text">Loading resume...</div>;

    return (
        <div className="dash-root" style={{ backgroundImage: `url(${bg})` }}>
        <div className="resume-builder-layout">

            {/* SIDEBAR */}
            <SectionSidebar resume={resume} saveChanges={saveChanges} />

            {/* MAIN EDITOR */}
            <div className="builder-main">

                {/* TITLE + PUBLISH */}
                <div className="builder-title-row">
                    <input
                        className="resume-title-input"
                        value={resume.title}
                        onChange={(e) => saveChanges({ title: e.target.value })}
                    />

                    <div className="publish-btn-wrapper">
                        <button
                            onClick={() => saveChanges({ isPublished: !resume.isPublished })}
                            className="publish-btn"
                        >
                            {resume.isPublished ? "Unpublish" : "Publish"}
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <ExportToPDF elementId="resume-export-area" />
                    </div>

                </div>

                {/* SECTION EDITOR */}
                <div id="resume-export-area">
                    <SectionEditor resume={resume} saveChanges={saveChanges} />
                </div>

            </div>

            {/* BACK BUTTON */}
            <button onClick={handleBackClick} className="back-btn">
                ← Back to Dashboard
            </button>

            {/* MODAL */}
            {showLeaveModal && (
                <div className="modal-bg">
                    <div className="modal-window">

                        <h2 className="modal-title">
                            Resume is not published
                        </h2>

                        <br/>

                        <p className="modal-text">
                            Do you want to publish it now or keep it as a draft?
                        </p>

                        <br/>

                        <div className="modal-options">
                            <button
                                onClick={publishNow}
                                className="modal-option-btn"
                                style={{ background: "#7B5984", color: "white" }}
                            >
                                Publish Resume
                            </button>

                            <button
                                onClick={leaveAsDraft}
                                className="modal-option-btn"
                                style={{ background: "#c6c6c6" }}
                            >
                                Save as Draft
                            </button>

                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="modal-option-btn"
                                style={{ background: "#e4e4e4" }}
                            >
                                Continue Editing
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
        </div>
    );
}

