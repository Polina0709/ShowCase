import type { AboutSection } from "../../../types/resume";
import { useState, useEffect } from "react";

interface Props {
    section: AboutSection;
    onChange: (data: AboutSection["data"]) => void;
}

export default function AboutEditor({ section, onChange }: Props) {
    const [value, setValue] = useState(section.data);

    // ✅ Debounce save: оновлюємо resume тільки через 500ms після вводу
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, 500);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm text-gray-500 mb-1">Headline</label>
                <input
                    className="w-full border px-3 py-2 rounded"
                    value={value.headline}
                    onChange={(e) => setValue({ ...value, headline: e.target.value })}
                    placeholder="e.g. Frontend Developer"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-500 mb-1">Bio</label>
                <textarea
                    className="w-full border px-3 py-2 rounded h-32 resize-none"
                    value={value.bio}
                    onChange={(e) => setValue({ ...value, bio: e.target.value })}
                    placeholder="Write a short introduction..."
                />
            </div>
        </div>
    );
}

