import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult
} from "@hello-pangea/dnd";

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

import AboutEditor from "./editors/AboutEditor";
import SkillsEditor from "./editors/SkillsEditor";
import ExperienceEditor from "./editors/ExperienceEditor";
import ProjectsEditor from "./editors/ProjectsEditor";
import ContactsEditor from "./editors/ContactsEditor";
import VideoEditor from "./editors/VideoEditor";

interface Props {
    resume: Resume;
    saveChanges: (changes: Partial<Resume>) => void;
    isPDF?: boolean;
}

/* ----------------------------------------------------
    STATIC PDF RENDERER (NO BUTTONS / NO EDITORS)
---------------------------------------------------- */
function renderPDF(section: ResumeSection) {
    switch (section.type) {
        case "about": {
            const s = section as AboutSection;
            return (
                <div className="pdf-section">
                    {s.data.headline && <h3 className="pdf-headline">{s.data.headline}</h3>}
                    {s.data.bio && <p className="pdf-text">{s.data.bio}</p>}
                </div>
            );
        }

        case "skills": {
            const s = section as SkillsSection;
            return (
                <ul className="pdf-skill-list">
                    {s.data.skills?.map((skill, i) => (
                        <li key={i} className="pdf-skill-item">{skill}</li>
                    ))}
                </ul>
            );
        }

        case "experience": {
            const s = section as ExperienceSection;
            return (
                <div className="pdf-exp-list">
                    {s.data.items?.map((item) => (
                        <div key={item.id} className="pdf-exp-item">
                            <h3 className="pdf-exp-title">{item.role}</h3>
                            <p className="pdf-exp-sub">{item.company} — {item.period}</p>
                            <p className="pdf-exp-desc">{item.description}</p>
                        </div>
                    ))}
                </div>
            );
        }

        case "projects": {
            const s = section as ProjectsSection;
            return (
                <div className="pdf-project-list">
                    {s.data.projects?.map((p) => (
                        <div key={p.id} className="pdf-project-item">
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            {p.link && <p className="pdf-link">{p.link}</p>}
                        </div>
                    ))}
                </div>
            );
        }

        case "contacts": {
            const s = section as ContactsSection;
            return (
                <div className="pdf-contacts">
                    {s.data.email && <p><strong>Email:</strong> {s.data.email}</p>}
                    {s.data.phone && <p><strong>Phone:</strong> {s.data.phone}</p>}
                    {s.data.linkedin && <p><strong>LinkedIn:</strong> {s.data.linkedin}</p>}
                    {s.data.github && <p><strong>GitHub:</strong> {s.data.github}</p>}
                    {s.data.portfolio && <p><strong>Portfolio:</strong> {s.data.portfolio}</p>}
                </div>
            );
        }

        default:
            return null;
    }
}

/* ----------------------------------------------------
    MAIN COMPONENT
---------------------------------------------------- */
export default function SectionEditor({ resume, saveChanges, isPDF }: Props) {
    const sections: ResumeSection[] = resume.sections ?? [];

    /* ----------------------------------------------------
        PDF MODE — STATIC, NO EDITING
    ---------------------------------------------------- */
    if (isPDF) {
        return (
            <div className="pdf-wrapper">
                {sections
                    .filter(sec => sec.type !== "video")
                    .map(section => (
                        <div key={section.id} className="pdf-section-card">
                            <h2 className="pdf-title">{section.type.toUpperCase()}</h2>
                            {renderPDF(section)}
                        </div>
                    ))}
            </div>
        );
    }

    /* ----------------------------------------------------
        NORMAL EDITOR MODE
    ---------------------------------------------------- */

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updated = [...sections];
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        saveChanges({ sections: updated });
    };

    const removeSection = (index: number) => {
        saveChanges({ sections: sections.filter((_, i) => i !== index) });
    };

    const updateSectionData = <T extends ResumeSection>(index: number, data: T["data"]) => {
        const updated = [...sections];
        updated[index] = { ...updated[index], data } as T;
        saveChanges({ sections: updated });
    };

    const renderEditor = (section: ResumeSection, index: number) => {
        switch (section.type) {
            case "about":
                return (
                    <AboutEditor
                        section={section as AboutSection}
                        onChange={(d) => updateSectionData<AboutSection>(index, d)}
                    />
                );

            case "skills":
                return (
                    <SkillsEditor
                        section={section as SkillsSection}
                        onChange={(d) => updateSectionData<SkillsSection>(index, d)}
                    />
                );

            case "experience":
                return (
                    <ExperienceEditor
                        section={section as ExperienceSection}
                        onChange={(d) => updateSectionData<ExperienceSection>(index, d)}
                    />
                );

            case "projects":
                return (
                    <ProjectsEditor
                        section={section as ProjectsSection}
                        onChange={(d) => updateSectionData<ProjectsSection>(index, d)}
                    />
                );

            case "contacts":
                return (
                    <ContactsEditor
                        section={section as ContactsSection}
                        onChange={(d) => updateSectionData<ContactsSection>(index, d)}
                    />
                );

            case "video":
                return (
                    <VideoEditor
                        section={section as VideoSection}
                        onChange={(d) =>
                            updateSectionData<VideoSection>(index, {
                                url: d.url ?? "",
                                videoUrl: d.videoUrl ?? d.url ?? ""
                            })
                        }
                    />
                );

            default:
                return <p className="empty-text">Unknown section</p>;
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {sections.length === 0 && (
                            <div className="soft-card" style={{ textAlign: "center", padding: 40 }}>
                                <p style={{ color: "rgba(0,0,0,0.45)" }}>No sections yet.</p>
                            </div>
                        )}

                        {sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="section-card"
                                    >
                                        <div className="section-header">
                                            <h3 className="section-title">{section.type}</h3>
                                            <button
                                                onClick={() => removeSection(index)}
                                                className="remove-btn"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {renderEditor(section, index)}
                                    </div>
                                )}
                            </Draggable>
                        ))}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}



