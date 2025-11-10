import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { ProjectsSection, ResumeProjectItem } from "../../../types/resume";

interface Props {
    section: ProjectsSection; // ✅ ВАЖЛИВО — конкретний тип, а не ResumeSection
    onChange: (data: ProjectsSection["data"]) => void;
}

export default function ProjectsEditor({ section, onChange }: Props) {
    const projects: ResumeProjectItem[] = section.data?.projects ?? [];

    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        link: "",
        imageUrl: "",
    });

    const addProject = () => {
        if (!newProject.title.trim()) return;

        const updated = [
            ...projects,
            { id: uuid(), ...newProject }
        ];

        onChange({ projects: updated });

        setNewProject({ title: "", description: "", link: "", imageUrl: "" });
    };

    const updateField = (index: number, field: keyof ResumeProjectItem, value: string) => {
        const updated = [...projects];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ projects: updated });
    };

    const removeProject = (index: number) => {
        const updated = projects.filter((_, i) => i !== index);
        onChange({ projects: updated });
    };

    return (
        <div className="space-y-6">
            {projects.length > 0 && projects.map((project, index) => (
                <div key={project.id} className="border rounded p-4 bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{project.title}</h4>
                        <button
                            onClick={() => removeProject(index)}
                            className="text-red-500 text-sm hover:underline"
                        >
                            Remove
                        </button>
                    </div>

                    <input
                        className="input mb-2"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => updateField(index, "title", e.target.value)}
                    />

                    <textarea
                        className="input mb-2"
                        placeholder="Short description of the project..."
                        value={project.description}
                        onChange={(e) => updateField(index, "description", e.target.value)}
                    />

                    <input
                        className="input mb-2"
                        placeholder="https://github.com/..."
                        value={project.link ?? ""}
                        onChange={(e) => updateField(index, "link", e.target.value)}
                    />

                    <input
                        className="input mb-2"
                        placeholder="Image URL (optional)"
                        value={project.imageUrl ?? ""}
                        onChange={(e) => updateField(index, "imageUrl", e.target.value)}
                    />
                </div>
            ))}

            <div className="border border-dashed rounded p-4">
                <h4 className="font-medium mb-2">Add New Project</h4>

                <input
                    className="input mb-2"
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />

                <textarea
                    className="input mb-2"
                    placeholder="Short description..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />

                <input
                    className="input mb-2"
                    placeholder="Project Link"
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                />

                <input
                    className="input mb-2"
                    placeholder="Image URL (optional)"
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                />

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    onClick={addProject}
                >
                    + Add Project
                </button>
            </div>
        </div>
    );
}
