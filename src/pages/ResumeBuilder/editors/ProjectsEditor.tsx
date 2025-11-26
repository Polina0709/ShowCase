import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import type { ProjectsSection, ResumeProjectItem } from "../../../types/resume";

interface Props {
    section: ProjectsSection;
    onChange: (data: ProjectsSection["data"]) => void;
}

export default function ProjectsEditor({ section, onChange }: Props) {
    const [projects, setProjects] = useState<ResumeProjectItem[]>(section.data?.projects ?? []);

    // синхронізація, якщо ззовні змінилась секція
    useEffect(() => {
        setProjects(section.data?.projects ?? []);
    }, [section.id]);

    const sync = (updated: ResumeProjectItem[]) => {
        setProjects(updated);
        onChange({ projects: updated });
    };

    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        link: "",
        imageUrl: "",
    });

    const addProject = () => {
        const trimmedTitle = newProject.title.trim();

        if (!trimmedTitle) {
            // ❗ ось тут тепер видно, що саме не так
            alert("Please enter Project Title before adding a project 🙂");
            return;
        }

        const project: ResumeProjectItem = {
            id: uuid(),
            title: trimmedTitle,
            description: newProject.description.trim(),
            link: newProject.link || undefined,
            imageUrl: newProject.imageUrl || undefined,
        };

        const updated = [...projects, project];
        sync(updated);

        setNewProject({
            title: "",
            description: "",
            link: "",
            imageUrl: "",
        });
    };

    const updateField = (index: number, field: keyof ResumeProjectItem, value: string) => {
        const updated = [...projects];
        updated[index] = { ...updated[index], [field]: value };
        sync(updated);
    };

    const removeProject = (index: number) => {
        const updated = projects.filter((_, i) => i !== index);
        sync(updated);
    };

    return (
        <div>
            {projects.map((project, index) => (
                <div
                    key={project.id}
                    className="inner-card"
                    style={{ padding: "18px", marginBottom: "16px" }}
                >
                    <div className="section-header">
                        <h4 style={{ fontSize: "16px", fontWeight: 600 }}>
                            {project.title || "Project"}
                        </h4>

                        <button
                            type="button"
                            className="remove-btn"
                            style={{
                                padding: "6px 10px",
                                fontSize: "13px",
                                borderRadius: "12px",
                                position: "static",
                            }}
                            onClick={() => removeProject(index)}
                        >
                            Remove
                        </button>
                    </div>

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
                        onChange={(e) => updateField(index, "description", e.target.value)}
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

            {/* Блок додавання нового проекту */}
            <div className="inner-card" style={{ padding: "18px", marginTop: "20px" }}>
                <h4 className="section-title" style={{ fontSize: "18px" }}>
                    Add New Project
                </h4>

                <input
                    className="round-input"
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    style={{ marginTop: 12 }}
                />

                <textarea
                    className="round-input"
                    placeholder="Short description..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    style={{ marginTop: 10 }}
                />

                <input
                    className="round-input"
                    placeholder="Project Link"
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                    style={{ marginTop: 10 }}
                />

                <input
                    className="round-input"
                    placeholder="Image URL (optional)"
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                    style={{ marginTop: 10 }}
                />

                <button
                    type="button"
                    className="purple-btn"
                    style={{ width: "100%", marginTop: 14 }}
                    onClick={addProject}
                >
                    + Add Project
                </button>
            </div>
        </div>
    );
}
