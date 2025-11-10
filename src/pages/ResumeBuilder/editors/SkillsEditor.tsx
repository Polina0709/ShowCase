import { useState, useEffect } from "react";
import type { ResumeSection } from "../../../types/resume";

interface Props {
    section: Extract<ResumeSection, { type: "skills" }>;
    onChange: (data: { skills: string[] }) => void;
}

export default function SkillsEditor({ section, onChange }: Props) {
    const initial = Array.isArray(section.data?.skills) ? section.data.skills : [];

    // ✅ локальний стейт — швидкий і без лагів
    const [skills, setSkills] = useState<string[]>(initial);

    // ✅ синхронізуємо при зовнішніх змінах
    useEffect(() => setSkills(initial), [section.data]);

    const updateSkill = (index: number, value: string) => {
        const updated = [...skills];
        updated[index] = value;
        setSkills(updated); // ✅ миттєво і не лагує
    };

    const commitSkills = () => {
        onChange({ skills }); // ✅ збереження лише коли завершили ввод (onBlur)
    };

    const addSkill = () => {
        const updated = [...skills, ""];
        setSkills(updated);
        onChange({ skills: updated }); // ✅ зміна структури → одразу синхронізуємо
    };

    const removeSkill = (index: number) => {
        const updated = skills.filter((_, i) => i !== index);
        setSkills(updated);
        onChange({ skills: updated });
    };

    return (
        <div className="space-y-3">
            {skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        className="border p-2 rounded w-full"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        onBlur={commitSkills} // ✅ передаємо у resume тільки після завершення вводу
                    />
                    <button
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:underline"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                onClick={addSkill}
                className="text-sm text-blue-600 hover:underline"
            >
                + Add skill
            </button>
        </div>
    );
}
