import { useState, useEffect } from "react";
import type { ResumeSection } from "../../../types/resume";

interface Props {
    section: Extract<ResumeSection, { type: "skills" }>;
    onChange: (data: { skills: string[] }) => void;
}

export default function SkillsEditor({ section, onChange }: Props) {
    const initial = Array.isArray(section.data?.skills) ? section.data.skills : [];
    const [skills, setSkills] = useState<string[]>(initial);

    // sync when external changes happen
    useEffect(() => setSkills(initial), [section.data]);

    const updateSkill = (index: number, value: string) => {
        const updated = [...skills];
        updated[index] = value;
        setSkills(updated);
    };

    const commitSkills = () => {
        onChange({ skills });
    };

    const addSkill = () => {
        const updated = [...skills, ""];
        setSkills(updated);
        onChange({ skills: updated });
    };

    const removeSkill = (index: number) => {
        const updated = skills.filter((_, i) => i !== index);
        setSkills(updated);
        onChange({ skills: updated });
    };

    return (
        <div className="inner-card" style={{ padding: "20px" }}>

            {/* List of skills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        style={{ display: "flex", alignItems: "center", gap: "10px" }}
                    >
                        <input
                            className="round-input"
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            onBlur={commitSkills}
                            placeholder="Skill"
                        />

                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="remove-btn"
                            style={{
                                padding: "6px 10px",
                                fontSize: "13px",
                                position: "static",
                                borderRadius: "12px"
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Skill */}
            <button
                type="button"
                className="purple-btn"
                style={{
                    marginTop: "16px",
                    padding: "10px 22px",
                    fontSize: "15px"
                }}
                onClick={addSkill}
            >
                + Add Skill
            </button>
        </div>
    );
}

