import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import {
    listenToResume,
    addResumeView
} from "../../services/dbResumes";

import { getUserRecord } from "../../services/dbUsers";

import type {
    Resume,
    ResumeSection,
    AboutSection,
    SkillsSection,
    ExperienceSection,
    ProjectsSection,
    ContactsSection,
    VideoSection
} from "../../types/resume";

import ExportToPDF from "../../components/ExportToPDF";

import bg from "../../assets/bg.jpg";
import "./PublicResume.css";

/* -----------------------------------------
   USER PROFILE TYPE
------------------------------------------ */
interface PublicProfile {
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

/* -----------------------------------------
   MAIN COMPONENT
------------------------------------------ */
export function PublicResume() {
    const { resumeId } = useParams();
    const [resume, setResume] = useState<Resume | null>(null);
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // REF for hidden PDF block
    const pdfRef = useRef<HTMLDivElement | null>(null);

    /* ----------- LOAD RESUME + PROFILE ---------- */
    useEffect(() => {
        if (!resumeId) return;

        listenToResume(resumeId, async (res) => {
            setResume(res ?? null);

            if (res?.owner) {
                const userData = await getUserRecord(res.owner);
                setProfile(userData ?? null);
            }

            if (res?.isPublished) {
                await addResumeView(resumeId, null);
            }

            setLoading(false);
        });
    }, [resumeId]);

    if (loading) return <div className="pr-loading">Loading…</div>;
    if (!resume) return <div className="pr-unavailable">Resume not found</div>;
    if (!resume.isPublished) return <div className="pr-unavailable">This resume is not published</div>;

    /* -----------------------------------------
       PAGE JSX
    ------------------------------------------ */
    return (
        <>
            {/* ============= VISIBLE PUBLIC PAGE ============= */}
            <div
                className="pr-page"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* HEADER */}
                <header className="pr-header">
                    <h1 className="pr-title">{resume.title}</h1>

                    <ExportToPDF
                        targetRef={pdfRef}
                        fileName={`${resume.title || "resume"}.pdf`}
                        className="pr-download-btn"
                    />
                </header>

                {/* USER CARD */}
                {profile && <UserCard profile={profile} />}

                {/* SECTIONS */}
                <div className="pr-content">
                    {resume.sections?.map((sec) => (
                        <div key={sec.id} className="pr-card">
                            <h2 className="pr-card-title">{capitalize(sec.type)}</h2>
                            {renderSection(sec)}
                        </div>
                    ))}
                </div>
            </div>

            {/* ================== HIDDEN PDF CLONE ================== */}
            <div
                ref={pdfRef}
                className="pdf-clone"
                style={{
                    position: "absolute",
                    top: "-100000px",
                    left: "-100000px",
                    width: "794px",
                    padding: "40px 20px",
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* TITLE */}
                <h1 className="pr-title">{resume.title}</h1>

                {/* USER CARD*/}
                {profile && <UserCard profile={profile} />}

                {/* SECTIONS WITHOUT VIDEO */}
                <div className="pr-content">
                    {resume.sections
                        ?.filter((s) => s.type !== "video")
                        .map((sec) => (
                            <div key={sec.id} className="pr-card pdf-page-avoid">
                                <h2 className="pr-card-title">{capitalize(sec.type)}</h2>
                                {renderSection(sec)}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

/* -----------------------------------------
   USER CARD
------------------------------------------ */
function UserCard({ profile }: { profile: PublicProfile }) {
    return (
        <div className="pr-user-card">
            <div className="pr-user-left">
                {profile.photoURL ? (
                    <img src={profile.photoURL} alt="user" className="pr-user-photo" />
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
                        {[profile.city, profile.country].filter(Boolean).join(", ")}
                    </p>
                )}

                <div className="pr-user-links">
                    {profile.linkedin && <a href={profile.linkedin}>LinkedIn</a>}
                    {profile.github && <a href={profile.github}>GitHub</a>}
                    {profile.portfolio && <a href={profile.portfolio}>Portfolio</a>}
                </div>
            </div>
        </div>
    );
}

/* -----------------------------------------
   SECTION RENDERERS
------------------------------------------ */
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderSection(section: ResumeSection, isPDF = false) {
    switch (section.type) {
        case "about": {
            const s = section as AboutSection;
            return (
                <>
                    {s.data.headline && <h3 className="pr-headline">{s.data.headline}</h3>}
                    {s.data.bio && <p className="pr-text">{s.data.bio}</p>}
                </>
            );
        }

        case "skills": {
            const s = section as SkillsSection;
            return (
                <ul className="pr-skill-list">
                    {s.data.skills?.map((skill, i) => (
                        <li key={i}>{skill}</li>
                    ))}
                </ul>
            );
        }

        case "experience": {
            const s = section as ExperienceSection;
            return (
                <div className="pr-exp-list">
                    {s.data.items?.map((item) => (
                        <div key={item.id} className="pr-exp-item">
                            <h3>{item.role}</h3>
                            <p className="pr-muted">{item.company} — {item.period}</p>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            );
        }

        case "projects": {
            const s = section as ProjectsSection;
            return (
                <div className="pr-project-list">
                    {s.data.projects?.map((p) => (
                        <div key={p.id} className="pr-project-card">
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            {p.link && <a href={p.link}>Visit →</a>}
                        </div>
                    ))}
                </div>
            );
        }

        case "contacts": {
            const s = section as ContactsSection;
            return (
                <div className="pr-contacts">
                    {s.data.email && <p><strong>Email:</strong> {s.data.email}</p>}
                    {s.data.phone && <p><strong>Phone:</strong> {s.data.phone}</p>}
                    {s.data.linkedin && <p><strong>LinkedIn:</strong> {s.data.linkedin}</p>}
                    {s.data.github && <p><strong>GitHub:</strong> {s.data.github}</p>}
                    {s.data.portfolio && <p><strong>Portfolio:</strong> {s.data.portfolio}</p>}
                </div>
            );
        }

        /* VIDEO */
        case "video": {
            if (isPDF) return null;

            const s = section as VideoSection;
            const url = s.data.videoUrl || s.data.url;
            if (!url) return null;

            const isYT =
                url.includes("youtube") ||
                url.includes("youtu.be") ||
                url.includes("watch?v=");

            const embed = isYT
                ? url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
                : url;

            return (
                <div className="pr-video">
                    {isYT ? (
                        <iframe className="video-preview" src={embed} allowFullScreen />
                    ) : (
                        <video className="video-preview" src={embed} controls playsInline />
                    )}
                </div>
            );
        }

        default:
            return null;
    }
}

















