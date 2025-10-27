import type {ContactsSection} from "../../../types/resume";

interface Props {
    section: ContactsSection;
    update: (section: ContactsSection) => void;
}

export default function ContactsEditor({ section, update }: Props) {
    const updateField = (field: keyof ContactsSection, value: string) => {
        update({ ...section, [field]: value });
    };

    return (
        <div className="space-y-3">
            <input
                className="border rounded p-2 w-full"
                placeholder="Email"
                value={section.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
            />
            <input
                className="border rounded p-2 w-full"
                placeholder="Phone"
                value={section.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
            />
            <input
                className="border rounded p-2 w-full"
                placeholder="LinkedIn"
                value={section.linkedin || ""}
                onChange={(e) => updateField("linkedin", e.target.value)}
            />
            <input
                className="border rounded p-2 w-full"
                placeholder="GitHub"
                value={section.github || ""}
                onChange={(e) => updateField("github", e.target.value)}
            />
        </div>
    );
}
