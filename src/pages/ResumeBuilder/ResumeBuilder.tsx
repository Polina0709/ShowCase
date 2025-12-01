import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type {
    AboutSection,
    ExperienceSection,
    ProjectsSection,
    Resume, ResumeContactsData,
    ResumeSection, SkillsSection, VideoSection
} from "../../types/resume";

import { listenToResume, updateResume } from "../../services/dbResumes";
import { getUserRecord } from "../../services/dbUsers";

import SectionSidebar from "./SectionSidebar";
import SectionEditor from "./SectionEditor";
import ExportToPDF from "../../components/ExportToPDF";

import "./resume-builder.css";
import "../PublicResume/PublicResume.css";
import bg from "../../assets/bg.jpg";

/* -------------------- USER PROFILE -------------------- */
interface UserProfile {
    name?: string;
    lastName?: string;
    email?: string;
    city?: string;
    country?: string;
    photoURL?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
}

export default function ResumeBuilder() {
    const { resumeId } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState<Resume | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // MODAL STATE
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] =
        useState<(() => void) | null>(null);

    const pdfRef = useRef<HTMLDivElement | null>(null);

    /* -------------------- LOAD RESUME + PROFILE -------------------- */
    useEffect(() => {
        if (!resumeId) return;

        listenToResume(resumeId, async res => {
            setResume(res ? normalizeResume(res) : null);


            if (res?.owner) {
                const userData = await getUserRecord(res.owner);
                setProfile(userData ?? null);
            }
        });
    }, [resumeId]);

    /* -------------------- SAVE CHANGES -------------------- */
    const saveChanges = (changes: Partial<Resume>) => {
        if (!resumeId) return;
        updateResume(resumeId, changes);
    };

    /* -------------------- NAVIGATION LOGIC -------------------- */
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
        pendingNavigation?.();
    };

    const leaveAsDraft = () => {
        setShowLeaveModal(false);
        pendingNavigation?.();
    };

    if (!resume) return <div className="loading-text">Loading resume...</div>;

    /* ------------------------------ RENDER ------------------------------ */
    return (
        <div className="dash-root" style={{ backgroundImage: `url(${bg})` }}>
            <div className="resume-builder-layout">

                {/* SIDEBAR */}
                <SectionSidebar resume={resume} saveChanges={saveChanges} />

                {/* MAIN */}
                <div className="builder-main">

                    {/* ===== TITLE + BUTTONS ===== */}
                    <div className="builder-title-row">

                        <input
                            className="resume-title-input"
                            value={resume.title}
                            onChange={e => saveChanges({ title: e.target.value })}
                        />

                        <div className="action-btns">
                            <button
                                onClick={() =>
                                    saveChanges({ isPublished: !resume.isPublished })
                                }
                                className="publish-btn"
                            >
                                {resume.isPublished ? "Unpublish" : "Publish"}
                            </button>

                            {/* PDF BUTTON */}
                            <ExportToPDF
                                targetRef={pdfRef}
                                fileName={`${resume.title || "resume"}.pdf`}
                                className="pdf-btn-inside-builder"
                            />
                        </div>
                    </div>

                    {/* EDITOR */}
                    <div id="resume-export-area">
                        <SectionEditor resume={resume} saveChanges={saveChanges} />
                    </div>
                </div>

                {/* BACK BUTTON */}
                <button onClick={handleBackClick} className="back-btn">
                    ← Back to Dashboard
                </button>

                {/* ---------------------- MODAL ---------------------- */}
                {showLeaveModal && (
                    <div className="modal-bg">
                        <div className="modal-window">

                            <h2 className="modal-title">
                                Resume is not published
                            </h2>

                            <br />

                            <p className="modal-text">
                                Do you want to publish it now or keep it as a draft?
                            </p>

                            <br />

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

            {/* ======================================================
                HIDDEN PDF VERSION — identical to PublicResume
            ====================================================== */}
            <div
                ref={pdfRef}
                className="pr-page"
                style={{
                    position: "absolute",
                    top: "-99999px",
                    left: "-99999px",
                    width: "794px",
                    padding: "40px 20px",
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="pr-header" style={{ justifyContent: "center" }}>
                    <h1 className="pr-title">{resume.title}</h1>
                </div>

                {/* USER CARD */}
                {profile && (
                    <div className="pr-user-card">
                        <div className="pr-user-left">
                            {profile.photoURL ? (
                                <img src={profile.photoURL} className="pr-user-photo" />
                            ) : (
                                <div className="pr-user-photo pr-user-fallback">
                                    {(profile.name || "U")[0]}
                                </div>
                            )}
                        </div>

                        <div className="pr-user-right">
                            <h2 className="pr-user-name">
                                {profile.name} {profile.lastName}
                            </h2>

                            {(profile.city || profile.country) && (
                                <p className="pr-user-location">
                                    {[profile.city, profile.country]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            )}

                            <div className="pr-user-links">
                                {profile.linkedin && <span>LinkedIn: {profile.linkedin}</span>}
                                {profile.github && <span>GitHub: {profile.github}</span>}
                                {profile.portfolio && (
                                    <span>Portfolio: {profile.portfolio}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* SECTIONS */}
                <div className="pr-content">
                    {resume.sections
                        ?.filter(sec => sec.type !== "video")
                        .map(section => (
                            <div key={section.id} className="pr-card pdf-page-avoid">
                                <h2 className="pr-card-title">
                                    {capitalize(section.type)}
                                </h2>
                                {renderPdfSection(normalizeSection(section))}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

/* ----------------------- Helpers ----------------------- */
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeResume(raw: unknown): Resume {
    if (typeof raw !== "object" || raw === null) {
        return {
            id: "",
            owner: "",
            title: "",
            isPublished: false,
            lastUpdated: Date.now(),
            views: 0,
            lastViewedBy: {},
            sections: []
        };
    }

    const obj = raw as Record<string, unknown>;

    return {
        id: typeof obj.id === "string" ? obj.id : "",
        owner: typeof obj.owner === "string" ? obj.owner : "",
        title: typeof obj.title === "string" ? obj.title : "",
        isPublished: typeof obj.isPublished === "boolean" ? obj.isPublished : false,
        lastUpdated: typeof obj.lastUpdated === "number" ? obj.lastUpdated : Date.now(),
        views: typeof obj.views === "number" ? obj.views : 0,
        lastViewedBy: typeof obj.lastViewedBy === "object" && obj.lastViewedBy !== null
            ? (obj.lastViewedBy as Record<string, number>)
            : {},
        sections: Array.isArray(obj.sections)
            ? obj.sections.map(normalizeSection)
            : []
    };
}

function normalizeSection(raw: unknown): ResumeSection {
    if (typeof raw !== "object" || raw === null) {
        return {
            id: crypto.randomUUID(),
            type: "about",
            data: { headline: "", bio: "" }
        };
    }

    const obj = raw as Record<string, unknown>;
    const id = typeof obj.id === "string" ? obj.id : crypto.randomUUID();
    const type = obj.type;

    // ---------------------- ABOUT ----------------------
    if (type === "about") {
        const data = obj.data as Partial<AboutSection["data"]> | undefined;
        return {
            id,
            type: "about",
            data: {
                headline: data?.headline ?? "",
                bio: data?.bio ?? ""
            }
        };
    }

    // ---------------------- SKILLS ----------------------
    if (type === "skills") {
        const data = obj.data as Partial<SkillsSection["data"]> | undefined;
        return {
            id,
            type: "skills",
            data: {
                skills: Array.isArray(data?.skills) ? data!.skills : []
            }
        };
    }

    // ---------------------- EXPERIENCE ----------------------
    if (type === "experience") {
        const data = obj.data as Partial<ExperienceSection["data"]> | undefined;
        return {
            id,
            type: "experience",
            data: {
                items: Array.isArray(data?.items) ? data.items : []
            }
        };
    }

    // ---------------------- PROJECTS ----------------------
    if (type === "projects") {
        const data = obj.data as Partial<ProjectsSection["data"]> | undefined;
        return {
            id,
            type: "projects",
            data: {
                projects: Array.isArray(data?.projects) ? data.projects : []
            }
        };
    }

    // ---------------------- CONTACTS ----------------------
    if (type === "contacts") {
        const data = obj.data as Partial<ResumeContactsData> | undefined;
        return {
            id,
            type: "contacts",
            data: {
                email: data?.email ?? "",
                phone: data?.phone ?? "",
                location: data?.location ?? "",
                linkedin: data?.linkedin ?? "",
                github: data?.github ?? "",
                portfolio: data?.portfolio ?? ""
            }
        };
    }

    // ---------------------- VIDEO ----------------------
    if (type === "video") {
        const data = obj.data as Partial<VideoSection["data"]> | undefined;
        return {
            id,
            type: "video",
            data: {
                videoUrl: data?.videoUrl ?? "",
                url: data?.url ?? ""
            }
        };
    }

    // ---------------------- DEFAULT (INVALID SECTION) ----------------------
    return {
        id,
        type: "about",
        data: { headline: "", bio: "" }
    };
}

function renderPdfSection(section: ResumeSection) {
    switch (section.type) {

        case "about":
            return (
                <>
                    {section.data.headline && (
                        <h3 className="pr-headline">{section.data.headline}</h3>
                    )}
                    {section.data.bio && (
                        <p className="pr-text">{section.data.bio}</p>
                    )}
                </>
            );

        case "skills":
            return (
                <ul className="pr-skill-list">
                    {section.data.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                    ))}
                </ul>
            );

        case "experience":
            return (
                <div className="pr-exp-list">
                    {section.data.items.map(item => (
                        <div key={item.id} className="pr-exp-item">
                            <h3>{item.role}</h3>
                            <p className="pr-muted">
                                {item.company} — {item.period}
                            </p>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            );

        case "projects":
            return (
                <div className="pr-project-list">
                    {section.data.projects.map(project => (
                        <div key={project.id} className="pr-project-card">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            {project.link && <a href={project.link}>Visit →</a>}
                        </div>
                    ))}
                </div>
            );

        case "contacts":
            return (
                <div className="pr-contacts">
                    {section.data.email && <p>Email: {section.data.email}</p>}
                    {section.data.phone && <p>Phone: {section.data.phone}</p>}
                    {section.data.linkedin && <p>LinkedIn: {section.data.linkedin}</p>}
                    {section.data.github && <p>GitHub: {section.data.github}</p>}
                    {section.data.portfolio && <p>Portfolio: {section.data.portfolio}</p>}
                </div>
            );

        case "video":
            return null;

        default:
            return null;
    }
}





