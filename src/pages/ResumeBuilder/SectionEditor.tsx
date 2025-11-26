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
}

export default function SectionEditor({ resume, saveChanges }: Props) {

    const sections: ResumeSection[] = resume.sections ?? [];

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updated = [...sections];
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        saveChanges({ sections: updated });
    };

    const removeSection = (index: number) => {
        const updated = sections.filter((_, i) => i !== index);
        saveChanges({ sections: updated });
    };

    /** Типобезпечне оновлення секцій */
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
                        onChange={(d) => updateSectionData<VideoSection>(index, d)}
                    />
                );

            default:
                return (
                    <p className="empty-text">
                        Unknown section
                    </p>
                );
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>

                        {/* No sections */}
                        {sections.length === 0 && (
                            <div className="soft-card" style={{ textAlign: "center", padding: "40px" }}>
                                <p style={{ color: "rgba(0,0,0,0.45)" }}>
                                    No sections yet.
                                </p>
                            </div>
                        )}

                        {/* Render sections */}
                        {sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="section-card"
                                    >
                                        {/* Section header */}
                                        <div className="section-header">
                                            <h3 style={{
                                                fontSize: "20px",
                                                fontWeight: 600,
                                                textTransform: "capitalize"
                                            }}>
                                                {section.type}
                                            </h3>

                                            <button
                                                onClick={() => removeSection(index)}
                                                className="remove-btn"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Section content */}
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
