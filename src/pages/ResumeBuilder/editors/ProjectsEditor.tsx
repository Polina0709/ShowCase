import type {ProjectSection} from "../../../types/resume";

interface Props {
    section: ProjectSection;
    update: (section: ProjectSection) => void;
}

export default function ProjectsEditor({ section, update }: Props) {
    const updateField = (field: keyof ProjectSection, value: string) => {
        update({ ...section, [field]: value });
    };

    return (
        <div className="space-y-3">
            <input
                className="border rounded p-2 w-full"
                placeholder="Project Name"
                value={section.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
            />

            <input
                className="border rounded p-2 w-full"
                placeholder="Project URL"
                value={section.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
            />

            <textarea
                className="border rounded p-2 w-full min-h-[80px]"
                placeholder="Description"
                value={section.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
            />
        </div>
    );
}

