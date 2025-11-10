import type { Resume, ResumeSection } from "../../types/resume";

interface Props {
    resume: Resume;
    saveChanges: (changes: Partial<Resume>) => void;
}

export default function SectionSidebar({ resume, saveChanges }: Props) {

    const addSection = (type: ResumeSection["type"]) => {
        let newSection: ResumeSection;

        switch (type) {
            case "about":
                newSection = { id: crypto.randomUUID(), type, data: { headline: "", bio: "" } };
                break;

            case "skills":
                newSection = { id: crypto.randomUUID(), type, data: { skills: [] } };
                break;

            case "experience":
                newSection = { id: crypto.randomUUID(), type, data: { items: [] } };
                break;

            case "projects":
                newSection = { id: crypto.randomUUID(), type, data: { projects: [] } };
                break;

            case "contacts":
                newSection = {
                    id: crypto.randomUUID(),
                    type,
                    data: {
                        email: "",
                        phone: "",
                        location: "",
                        linkedin: "",
                        github: "",
                        portfolio: ""
                    }
                };
                break;

            case "video":
                newSection = { id: crypto.randomUUID(), type, data: { url: "" } };
                break;

            default:
                return;
        }

        saveChanges({
            sections: [...(resume.sections ?? []), newSection],
        });
    };

    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 space-y-4">
            <br/>
            <br/>
            <h3 className="font-semibold text-lg mb-2">Add Section</h3>

            <button className="sidebar-btn" onClick={() => addSection("about")}>+ About</button>
            <button className="sidebar-btn" onClick={() => addSection("skills")}>+ Skills</button>
            <button className="sidebar-btn" onClick={() => addSection("experience")}>+ Experience</button>
            <button className="sidebar-btn" onClick={() => addSection("projects")}>+ Projects</button>
            <button className="sidebar-btn" onClick={() => addSection("contacts")}>+ Contacts</button>
            <button className="sidebar-btn" onClick={() => addSection("video")}>+ Pitch Video</button>
        </div>
    );
}
