import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";
import type {Resume, ResumeSection} from "../../types/resume";

import AboutEditor from "./editors/AboutEditor";
import SkillsEditor from "./editors/SkillsEditor";
import ExperienceEditor from "./editors/ExperienceEditor";
import ProjectsEditor from "./editors/ProjectsEditor";
import ContactsEditor from "./editors/ContactsEditor";
import VideoEditor from "./editors/VideoEditor";

interface Props {
    resume: Resume;
    saveChanges: (c: Partial<Resume>) => void;
}

export default function SectionEditor({ resume, saveChanges }: Props) {
    const deleteSection = (id: string) => {
        saveChanges({
            sections: resume.sections.filter((s) => s.id !== id),
        });
    };

    const renderEditor = (section: ResumeSection, update: (val: ResumeSection) => void) => {
        switch (section.type) {
            case "about":
                return (
                    <AboutEditor
                        section={section}
                        update={(content) => update({ ...section, content })}
                    />
                );
            case "skills":
                return (
                    <SkillsEditor
                        section={section}
                        update={(items) => update({ ...section, items })}
                    />
                );
            case "experience":
                return (
                    <ExperienceEditor
                        section={section}
                        update={(data) => update(data)}
                    />
                );
            case "projects":
                return (
                    <ProjectsEditor
                        section={section}
                        update={(data) => update(data)}
                    />
                );
            case "contacts":
                return (
                    <ContactsEditor
                        section={section}
                        update={(data) => update(data)}
                    />
                );
            case "video":
                return (
                    <VideoEditor
                        section={section}
                        update={(data) => update(data)}
                    />
                );
            default:
                return null;
        }
    };

    const updateSection = (id: string, data: ResumeSection) => {
        const updated = resume.sections.map((s) =>
            s.id === id ? { ...data } : s
        );

        saveChanges({ sections: updated });
    };

    return (
        <DragDropContext
            onDragEnd={(result) => {
                if (!result.destination) return;

                const items = Array.from(resume.sections);
                const [reordered] = items.splice(result.source.index, 1);
                items.splice(result.destination.index, 0, reordered);

                saveChanges({ sections: items });
            }}
        >
            <Droppable droppableId="sections">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-6"
                    >
                        {resume.sections.map((section, index) => (
                            <Draggable
                                key={section.id}
                                draggableId={section.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                        {...provided.draggableProps}
                                        className="border bg-white p-4 rounded-md shadow-sm relative"
                                    >
                                        <button
                                            className="absolute top-2 right-2 text-red-500 text-sm"
                                            onClick={() => deleteSection(section.id)}
                                        >
                                            ✕
                                        </button>

                                        {renderEditor(section, (val: ResumeSection) =>
                                            updateSection(section.id, val)
                                        )}
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
