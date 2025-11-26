import type { AboutSection } from "../../../types/resume";
import { useState, useEffect } from "react";

interface Props {
    section: AboutSection;
    onChange: (data: AboutSection["data"]) => void;
}

export default function AboutEditor({ section, onChange }: Props) {
    const [value, setValue] = useState(section.data);

    // Debounce 500ms
    useEffect(() => {
        const timeout = setTimeout(() => onChange(value), 500);
        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="inner-card" style={{ padding: "20px", borderRadius: "18px" }}>

            {/* Headline */}
            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", opacity: 0.6, marginBottom: "6px" }}>
                    Headline
                </label>

                <input
                    className="round-input"
                    value={value.headline}
                    onChange={(e) => setValue({ ...value, headline: e.target.value })}
                    placeholder="e.g. Frontend Developer"
                />
            </div>

            {/* Bio */}
            <div>
                <label style={{ display: "block", fontSize: "14px", opacity: 0.6, marginBottom: "6px" }}>
                    Bio
                </label>

                <textarea
                    className="round-input"
                    style={{ minHeight: "100px" }}
                    value={value.bio}
                    onChange={(e) => setValue({ ...value, bio: e.target.value })}
                    placeholder="Write a short introduction..."
                />
            </div>
        </div>
    );
}


