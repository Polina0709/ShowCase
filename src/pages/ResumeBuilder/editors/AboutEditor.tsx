import type {AboutSection} from "../../../types/resume";

interface Props {
    section: AboutSection;
    update: (content: string) => void;
}

export default function AboutEditor({ section, update }: Props) {
    return (
        <textarea
            className="w-full border rounded p-2 min-h-[120px]"
            value={section.content || ""}
            onChange={(e) => update(e.target.value)}
        />
    );
}
