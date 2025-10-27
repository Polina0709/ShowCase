import { useState } from "react";
import type {SkillSection} from "../../../types/resume";

interface Props {
    section: SkillSection;
    update: (items: string[]) => void;
}

export default function SkillsEditor({ section, update }: Props) {
    const [skill, setSkill] = useState("");

    const addSkill = () => {
        if (!skill.trim()) return;
        update([...section.items, skill]);
        setSkill("");
    };

    const removeSkill = (i: number) => {
        update(section.items.filter((_, idx) => idx !== i));
    };

    return (
        <div>
            <div className="flex gap-2 mb-3">
                <input
                    className="border p-2 flex-grow"
                    placeholder="React, TypeScript..."
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                />
                <button onClick={addSkill} className="bg-blue-600 text-white px-3 rounded">
                    Add
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {section.items.map((s, i) => (
                    <div key={i} className="bg-gray-200 px-2 py-1 rounded flex gap-1">
                        {s}
                        <button className="text-red-500" onClick={() => removeSkill(i)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
