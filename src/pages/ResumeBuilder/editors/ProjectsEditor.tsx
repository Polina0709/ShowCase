import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import type { ProjectsSection, ResumeProjectItem } from "../../../types/resume";

interface Props {
    section: ProjectsSection;
    onChange: (data: ProjectsSection["data"]) => void;
}

export default function ProjectsEditor({ section, onChange }: Props) {
    const [projects, setProjects] = useState<ResumeProjectItem[]>(
        section.data?.projects ?? []
    );

    useEffect(() => {
        setProjects(section.data?.projects ?? []);
    }, [section.id, section.data]);

    const sync = (updated: ResumeProjectItem[]) => {
        setProjects(updated);
        onChange({ projects: updated });
    };

    const addProject = () => {
        const project: ResumeProjectItem = {
            id: uuid(),
            title: "",
            description: "",
            link: "",
            imageUrl: "",
        };

        sync([...projects, project]);
    };

    const updateField = (
        index: number,
        field: keyof ResumeProjectItem,
        value: string
    ) => {
        const updated = [...projects];
        updated[index] = { ...updated[index], [field]: value };
        sync(updated);
    };

    const removeProject = (index: number) => {
        sync(projects.filter((_, i) => i !== index));
    };

    return (
        <div>
            {projects.map((project, index) => (
                <div
                    key={project.id}
                    className="inner-card"
                    style={{
                        padding: "18px",
                        marginBottom: "16px",
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        position: "relative"
                    }}
                >
                    <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeProject(index)}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "#ff4d4d",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px"
                        }}
                    >
                        Remove
                    </button>

                    <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                        {project.title || "Project"}
                    </h4>

                    <input
                        className="round-input"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => updateField(index, "title", e.target.value)}
                        style={{ marginTop: 12 }}
                    />

                    <textarea
                        className="round-input"
                        placeholder="Short description..."
                        value={project.description}
                        onChange={(e) =>
                            updateField(index, "description", e.target.value)
                        }
                        style={{ marginTop: 8 }}
                    />

                    <input
                        className="round-input"
                        placeholder="Project Link"
                        value={project.link ?? ""}
                        onChange={(e) => updateField(index, "link", e.target.value)}
                        style={{ marginTop: 8 }}
                    />

                    <input
                        className="round-input"
                        placeholder="Image URL (optional)"
                        value={project.imageUrl ?? ""}
                        onChange={(e) => updateField(index, "imageUrl", e.target.value)}
                        style={{ marginTop: 8 }}
                    />
                </div>
            ))}

            <button
                type="button"
                className="purple-btn"
                style={{ width: "100%", marginTop: 14 }}
                onClick={addProject}
            >
                + Add Project
            </button>
        </div>
    );
}
