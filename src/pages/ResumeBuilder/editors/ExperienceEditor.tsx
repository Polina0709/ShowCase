import type {ExperienceSection} from "../../../types/resume";

interface Props {
    section: ExperienceSection;
    update: (section: ExperienceSection) => void;
}

export default function ExperienceEditor({ section, update }: Props) {
    const updateField = (field: keyof ExperienceSection, value: string) => {
        update({ ...section, [field]: value });
    };

    return (
        <div className="space-y-3">
            <input
                className="border rounded p-2 w-full"
                placeholder="Position"
                value={section.position || ""}
                onChange={(e) => updateField("position", e.target.value)}
            />

            <input
                className="border rounded p-2 w-full"
                placeholder="Company"
                value={section.company || ""}
                onChange={(e) => updateField("company", e.target.value)}
            />

            <input
                className="border rounded p-2 w-full"
                placeholder="Years"
                value={section.years || ""}
                onChange={(e) => updateField("years", e.target.value)}
            />

            <textarea
                className="border rounded p-2 w-full min-h-[80px]"
                placeholder="Describe your role..."
                value={section.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
            />
        </div>
    );
}
