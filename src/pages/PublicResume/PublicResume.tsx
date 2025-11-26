import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { listenToResume, addResumeView } from "../../services/dbResumes";
import type {
    Resume,
    ResumeSection,
    AboutSection,
    SkillsSection,
    ExperienceSection,
    ProjectsSection,
    VideoSection,
    ContactsSection
} from "../../types/resume";

import { useAuth } from "../../hooks/useAuth";
import "./PublicResume.css";

export default function PublicResume() {
    const { resumeId } = useParams();
    const { user } = useAuth();

    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);

    // --- LOAD RESUME + COUNT VIEW ---
    useEffect(() => {
        if (!resumeId) return;

        listenToResume(resumeId, async (res) => {
            setResume(res);
            setLoading(false);

            // Якщо резюме публічне — рахуємо перегляд
            if (res?.isPublished) {
                await addResumeView(resumeId, user ? user.uid : null);
            }
        });
    }, [resumeId, user]);

    // --- LOADING ---
    if (loading) {
        return <div className="pr-loading">Loading resume...</div>;
    }

    // --- RESUME NOT FOUND ---
    if (!resume) {
        return (
            <div className="pr-unpublished">
                <h2>Resume not found</h2>
                <p>The link might be invalid.</p>
            </div>
        );
    }

    // --- RESUME NOT PUBLISHED ---
    if (!resume.isPublished) {
        return (
            <div className="pr-unpublished">
                <h2>This resume is not published</h2>
                <p>The owner has restricted public access.</p>
            </div>
        );
    }

    return (
        <div className="pr-root">
            <div className="pr-container">
                <h1 className="pr-title">{resume.title}</h1>

                {/* Render sections */}
                {resume.sections?.map((section) => (
                    <div key={section.id} className="pr-section">
                        <h2 className="pr-section-title">
                            {capitalize(section.type)}
                        </h2>

                        {renderSection(section)}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------------- Helper: Capitalize -------------------------- */
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/* -------------------------- Section Renderer ---------------------------- */
function renderSection(section: ResumeSection) {
    switch (section.type) {
        case "about":
            return renderAbout(section as AboutSection);

        case "skills":
            return renderSkills(section as SkillsSection);

        case "experience":
            return renderExperience(section as ExperienceSection);

        case "projects":
            return renderProjects(section as ProjectsSection);

        case "contacts":
            return renderContacts(section as ContactsSection);

        case "video":
            return renderVideo(section as VideoSection);

        default:
            return <p>Unknown section</p>;
    }
}

/* -------------------------- ABOUT -------------------------------------- */
function renderAbout(section: AboutSection) {
    return (
        <div>
            <h3 className="pr-headline">{section.data.headline}</h3>
            <p className="pr-text">{section.data.bio}</p>
        </div>
    );
}

/* -------------------------- SKILLS ------------------------------------- */
function renderSkills(section: SkillsSection) {
    return (
        <ul className="pr-list">
            {section.data.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
            ))}
        </ul>
    );
}

/* -------------------------- EXPERIENCE --------------------------------- */
function renderExperience(section: ExperienceSection) {
    return (
        <div className="pr-exp-list">
            {section.data.items.map((item) => (
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
}

/* -------------------------- PROJECTS ----------------------------------- */
function renderProjects(section: ProjectsSection) {
    return (
        <div className="pr-projects">
            {section.data.projects.map((p) => (
                <div key={p.id} className="pr-project-card">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>

                    {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer">
                            Visit Project →
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}

/* -------------------------- CONTACTS ----------------------------------- */
function renderContacts(section: ContactsSection) {
    const data = section.data;

    return (
        <div className="pr-contacts">
            {data.email && <p><strong>Email:</strong> {data.email}</p>}
            {data.phone && <p><strong>Phone:</strong> {data.phone}</p>}
            {data.location && <p><strong>Location:</strong> {data.location}</p>}
            {data.linkedin && <p><strong>LinkedIn:</strong> {data.linkedin}</p>}
            {data.github && <p><strong>GitHub:</strong> {data.github}</p>}
            {data.portfolio && <p><strong>Portfolio:</strong> {data.portfolio}</p>}
        </div>
    );
}

/* -------------------------- VIDEO -------------------------------------- */
function renderVideo(section: VideoSection) {
    const url = section.data.url;

    if (!url) return null;

    // YouTube embed
    if (url.includes("youtube") || url.includes("youtu.be")) {
        return (
            <div className="pr-video">
                <iframe
                    src={url
                        .replace("watch?v=", "embed/")
                        .replace("youtu.be/", "youtube.com/embed/")}
                    allowFullScreen
                />
            </div>
        );
    }

    // Regular video
    return (
        <div className="pr-video">
            <video src={url} controls />
        </div>
    );
}

