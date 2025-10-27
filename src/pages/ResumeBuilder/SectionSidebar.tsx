import type {Resume} from "../../types/resume";
import type {SectionType} from "./types";

const SECTION_OPTIONS: { label: string; type: SectionType }[] = [
    { label: "About", type: "about" },
    { label: "Skills", type: "skills" },
    { label: "Experience", type: "experience" },
    { label: "Projects", type: "projects" },
    { label: "Contacts", type: "contacts" },
    { label: "Video Pitch", type: "video" },
];

interface Props {
    resume: Resume;
    saveChanges: (c: Partial<Resume>) => void;
}

export default function SectionSidebar({ resume, saveChanges }: Props) {
    const addSection = (type: SectionType) => {
        const newSection = {
            id: crypto.randomUUID(),
            type,
            content: "",
            items: [],
        };

        saveChanges({
            sections: [...resume.sections, newSection],
        });
    };

    return (
        <div className="w-64 border-r border-gray-200 p-4 space-y-2 bg-gray-50">
            <h3 className="font-semibold mb-4">Add Section</h3>
            {SECTION_OPTIONS.map((s) => (
                <button
                    key={s.type}
                    onClick={() => addSection(s.type)}
                    className="block w-full text-left px-3 py-2 bg-white border rounded hover:bg-gray-100"
                >
                    {s.label}
                </button>
            ))}
        </div>
    );
}
